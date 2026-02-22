import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: { url: string; client: SupabaseClient } | null = null;

/**
 * Server-only Supabase client (API routes, Server Components).
 * Do not import in client components.
 * Reads env at call time so the correct project is used after env changes.
 */
export function getSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  if (!cached || cached.url !== supabaseUrl) {
    cached = { url: supabaseUrl, client: createClient(supabaseUrl, supabaseServiceRoleKey) };
  }
  return cached.client;
}
