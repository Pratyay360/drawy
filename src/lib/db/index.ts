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
    "53300",
]);

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

/**
 * Database URL resolution (Hyperdrive-aware but runtime-agnostic):
 * 1. Hyperdrive binding in Cloudflare Workers: env.HYPERDRIVE.connectionString
 * 2. Direct DATABASE_URL env var (local dev / non-Workers)
 */
function resolveDatabaseUrl(): string {
    // In Workers the binding is injected as global env via cloudflare:workers if needed.
    // Here we prefer DATABASE_URL, falling back to Hyperdrive connectionString when available.
    const g = globalThis as unknown as { HYPERDRIVE?: { connectionString: string } };
    if (g.HYPERDRIVE?.connectionString) return g.HYPERDRIVE.connectionString;
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    return url;
}

const url = resolveDatabaseUrl();

const usesNeon = /\.neon\.(tech|build)$/.test(new URL(url).hostname);
const isHyperdriveLocal = url.includes("localhost") || url.includes("127.0.0.1");

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
    return postgres(url, {
        max: isHyperdriveLocal ? 1 : 2,
        connect_timeout: 10,
        idle_timeout: 20,
        prepare: false,
    });
}

const client = usesNeon
    ? drizzleHttp(createNeonClient(), { schema })
    : drizzleTcp(createPostgresClient(), { schema });

export const db = client as unknown as ReturnType<typeof drizzleTcp<typeof schema>>;

export function getDb(): typeof db {
    return db;
}
