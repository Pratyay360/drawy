import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function getSupabaseConfig() {
    const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
        throw new Error("SUPABASE_URL must be set.");
    }
    if (!secretKey) {
        throw new Error("SUPABASE_SECRET_KEY must be set.");
    }

    return { url, secretKey };
}

export function createSupabaseAdminClient() {
    if (!adminClient) {
        const { url, secretKey } = getSupabaseConfig();
        adminClient = createClient(url, secretKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        });
    }

    return adminClient;
}