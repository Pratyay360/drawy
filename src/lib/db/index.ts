import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleTcp } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/** Failure codes that mean "try again", not "this will never work". */
const TRANSIENT_CODES = new Set([
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "EPIPE",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "EAI_AGAIN",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_SOCKET",
    // Neon answers with 53300 when the connection budget of the plan is used up.
    "53300",
]);

/**
 * Walk the `cause` chain of an error and report whether it is worth retrying.
 *
 * A dropped connection is worth another attempt, a violated constraint is not.
 */
function isTransient(error: unknown): boolean {
    let current: unknown = error;

    for (let depth = 0; current && depth < 5; depth++) {
        const { code, message } = current as { code?: unknown; message?: unknown };

        if (typeof code === "string" && TRANSIENT_CODES.has(code)) return true;
        if (typeof message === "string") {
            if (message.includes("fetch failed")) return true;
            if (message.includes("too_many_connections")) return true;
        }

        current = (current as { cause?: unknown }).cause;
    }

    return false;
}

/**
 * Run a query and repeat it when the connection to the database fails.
 *
 * The network between the function and the database still drops connections
 * now and then. A single failed query must not sign a visitor out or report a
 * wrong password, so the query is tried again before the failure is passed on.
 */
export async function withRetry<T>(query: () => Promise<T>, attempts = 4): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            return await query();
        } catch (error) {
            lastError = error;

            const isLastAttempt = attempt === attempts - 1;
            if (isLastAttempt || !isTransient(error)) break;

            await new Promise((resolve) => setTimeout(resolve, 200 * 2 ** attempt));
        }
    }

    throw lastError;
}

const url = process.env.DATABASE_URL!;

/**
 * Neon is reached over its HTTP driver on purpose: the app runs on serverless
 * functions, where a long lived TCP connection to port 5432 is either blocked
 * by the host or exhausts the connection budget of the database. Every other
 * Postgres keeps the plain TCP driver, so a self-hosted server still works.
 */
const usesNeon = /\.neon\.(tech|build)$/.test(new URL(url).hostname);

type QueryFn = (queryText: string, values?: unknown[], options?: unknown) => Promise<unknown>;

function createNeonClient() {
    const rawClient = neon(url, { disableWarningInBrowsers: true });
    const rawQuery = rawClient.query as unknown as QueryFn;

    const client = Object.assign(
        (strings: TemplateStringsArray, ...values: unknown[]) => rawClient(strings, ...values),
        rawClient,
    );

    client.query = ((queryText: string, values?: unknown[], options?: unknown) =>
        withRetry(() => rawQuery(queryText, values, options))) as typeof client.query;

    return client;
}

function createPostgresClient() {
    // A small pool: a serverless function opens a connection per instance and
    // the database counts every one of them.
    return postgres(url, {
        max: 2,
        connect_timeout: 10,
        idle_timeout: 20,
        prepare: false,
    });
}

const client = usesNeon
    ? drizzleHttp(createNeonClient(), { schema })
    : drizzleTcp(createPostgresClient(), { schema });

// Both drivers speak the same SQL and return the same rows; only the transport
// differs. The app does not use transactions, which the HTTP driver cannot
// offer.
export const db = client as unknown as ReturnType<typeof drizzleTcp<typeof schema>>;