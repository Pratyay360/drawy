import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function isTransient(error: unknown): boolean {
  let current: unknown = error;

  for (let depth = 0; current && depth < 5; depth++) {
    const { code, message } = current as { code?: unknown; message?: unknown };

    if (typeof code === "string") return true;
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

const url = env.HYPERDRIVE?.connectionString ?? process.env.DATABASE_URL!;

function createPostgresClient() {
  return postgres(url, {
    max: 2,
    connect_timeout: 10,
    idle_timeout: 20,
    prepare: false,
  });
}

const client = drizzle(createPostgresClient(), { schema });

export const db = client as ReturnType<typeof drizzle<typeof schema>>;
