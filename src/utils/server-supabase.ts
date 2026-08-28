import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function createSupabaseAdminClient() {
	if (adminClient) return adminClient;
	const url = process.env.VITE_SUPABASE_URL!;
	const secretKey = process.env.SUPABASE_SECRET_KEY!;
	adminClient = createClient(url, secretKey, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
		},
	});
	return adminClient;
}
