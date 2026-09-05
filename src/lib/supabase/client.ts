/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient;

function getEnv(key: string): string | undefined {
	// Vite exposes VITE_ prefix to client via import.meta.env; also check process.env for SSR
	const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
	return metaEnv?.[`VITE_${key}`] ?? metaEnv?.[key] ?? process.env[`VITE_${key}`] ?? process.env[key];
}

export function createClient(): SupabaseClient {
	if (client) return client;
	const url = getEnv("SUPABASE_URL");
	const key = getEnv("SUPABASE_PUBLISHABLE_KEY");
	if (!url || !key) {
		throw new Error(
			"Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set (check .env and Vercel env). Received url=" +
				String(url) +
				" key=" +
				(String(key)?.slice(0, 8) ?? "undefined"),
		);
	}
	client = createBrowserClient(url, key);
	return client;
}
