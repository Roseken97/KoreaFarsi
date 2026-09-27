import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Service-role Supabase client (bypasses RLS). Server-only: knowledge_sources
 * and chat_messages have no public policies. Returns null when not configured.
 *
 * Thin wrapper over the shared admin client — kept here so the rest of this
 * module still only ever imports from within lib/chat-agent (PROJECT_BRIEF §4b:
 * no dependency on anything outside this folder except the DB client itself).
 */
export function chatStore(): SupabaseClient | null {
  return supabaseAdmin();
}
