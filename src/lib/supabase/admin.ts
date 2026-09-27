import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasServiceRole = () => Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

let admin: SupabaseClient | null = null;

/**
 * Service-role Supabase client (bypasses RLS). Server-only — used wherever a
 * feature needs to read/write tables that have no public policy (e.g.
 * knowledge_sources, or granting a user_library entitlement from /admin).
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (!hasServiceRole()) return null;
  admin ??= createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
