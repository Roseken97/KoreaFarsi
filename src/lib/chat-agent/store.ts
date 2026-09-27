import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { chatConfig, hasChatStore } from "./config";

let admin: SupabaseClient | null = null;

/**
 * Service-role Supabase client (bypasses RLS). Server-only: knowledge_sources
 * and chat_messages have no public policies. Returns null when not configured.
 */
export function chatStore(): SupabaseClient | null {
  if (!hasChatStore()) return null;
  admin ??= createClient(chatConfig.supabaseUrl, chatConfig.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
