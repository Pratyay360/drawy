import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient;

export function getSupabaseBrowserClient(): SupabaseClient {
	const url: string = import.meta.env.VITE_SUPABASE_URL!;
	const key: string = import.meta.env.VITE_SUPABASE_PUBLIC_KEY!;

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
