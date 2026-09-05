import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient;

function getEnv(key: string): string | undefined {
	const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
	return metaEnv?.[`VITE_${key}`] ?? metaEnv?.[key] ?? process.env[`VITE_${key}`] ?? process.env[key];
}

export function getSupabaseBrowserClient(): SupabaseClient {
	const url = getEnv("SUPABASE_URL");
	const key = getEnv("SUPABASE_PUBLISHABLE_KEY");
	if (!url || !key) {
		throw new Error(
			"Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set (check .env and Vercel env). Received url=" +
				String(url),
		);
	}

	if (browserClient) return browserClient;

	browserClient = createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
		realtime: {
			params: { eventsPerSecond: 30 },
		},
	});

	return browserClient;
}
