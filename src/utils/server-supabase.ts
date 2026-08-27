import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function createSupabaseAdminClient() {
  if (adminClient) return adminClient;
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? process.env.VITE_SUPABASE_URL!;
  const secretKey = (import.meta.env.SUPABASE_SECRET_KEY as string | undefined) ?? process.env.SUPABASE_SECRET_KEY!;
  if (!url || !secretKey) throw new Error("supabaseKey is required.");
  adminClient = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return adminClient;
}
