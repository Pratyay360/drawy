import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient;

export function createSupabaseAdminClient() {
	if (!adminClient) {
		adminClient = createClient(
			process.env.VITE_SUPABASE_URL,
			process.env.SUPABASE_SECRET_KEY,
			{
				auth: {
					autoRefreshToken: true,
					persistSession: true,
					detectSessionInUrl: true,
				},
			},
		);
	}

	return adminClient;
}
