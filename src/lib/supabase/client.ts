/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient;

export function createClient(): SupabaseClient {
    if (client) return client;
    client = createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_PUBLIC_KEY!,
    );
    return client;
}