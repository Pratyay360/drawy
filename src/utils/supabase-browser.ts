import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let initialized = false;

function readEnv(key: string): string | undefined {
    const env = import.meta.env as Record<string, string | undefined>;
    return env[key];
}

/**
 * A browser-side Supabase client used only for Realtime (broadcast + presence).
 * It uses the publishable key, which is safe to expose and can open Realtime
 * channels without Supabase Auth. All database reads/writes stay server-side
 * through the admin client.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
    if (typeof window === "undefined") return null;
    if (browserClient) return browserClient;
    if (initialized) return null;

    const url = readEnv("VITE_SUPABASE_URL");
    const key = readEnv("VITE_SUPABASE_KEY");
    if (!url || !key) {
        initialized = true;
        return null;
    }

    browserClient = createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        realtime: {
            params: { eventsPerSecond: 20 },
        },
    });

    return browserClient;
}