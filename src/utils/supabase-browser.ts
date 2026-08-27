import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient;

export function getSupabaseBrowserClient(): SupabaseClient {
    const url: string = import.meta.env.VITE_SUPABASE_URL!;
    const key: string = import.meta.env.VITE_SUPABASE_PUBLIC_KEY!;

    // if (!url || !key) {
    //   // Missing config should degrade gracefully instead of throwing during
    //   // a React effect and unmounting the whole Sidebar via the error boundary.
    //   return null;
    // }

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