import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

function getServerEnv(key: string): string | undefined {
	const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> })?.env;
	return process.env[key] ?? process.env[`VITE_${key}`] ?? metaEnv?.[key] ?? metaEnv?.[`VITE_${key}`];
}

export function createSupabaseAdminClient() {
	if (adminClient) return adminClient;
	const url = getServerEnv("SUPABASE_URL");
	const secretKey = getServerEnv("SUPABASE_SECRET_KEY");
	if (!url || !secretKey) {
		throw new Error(
			"Missing Supabase server env vars: SUPABASE_URL and SUPABASE_SECRET_KEY must be set (check .env / Vercel env). Received url=" +
				String(url),
		);
	}
	adminClient = createClient(url, secretKey, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
		},
	});
	return adminClient;
}
