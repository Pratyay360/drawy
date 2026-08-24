import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
	// Vite only exposes env vars to the browser when they are VITE_-prefixed
	// (read via import.meta.env). `process.env` is undefined in the browser
	// unless polyfilled, which is what caused "supabaseUrl is required".
	const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
	const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

	if (!url || !key) {
		// Missing config should degrade gracefully instead of throwing during
		// a React effect and unmounting the whole Sidebar via the error boundary.
		return null;
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
