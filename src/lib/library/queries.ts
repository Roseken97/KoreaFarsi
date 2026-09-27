import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { LibraryEntry } from "./types";

/** The signed-in user's library, newest grant first. Empty (not an error) for guests or when Supabase isn't configured. */
export async function getMyLibrary(): Promise<LibraryEntry[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data, error } = await supabase
    .from("user_library")
    .select("id, granted_at, source, product:products(*)")
    .eq("user_id", auth.user.id)
    .order("granted_at", { ascending: false });

  if (error) {
    console.error("[library] failed to load user_library:", error.message);
    return [];
  }
  // Supabase types this join as an array; a foreign-key join always returns at most one row.
  return (data ?? []).map((row) => ({ ...row, product: (row.product as never as LibraryEntry["product"][])[0] }));
}
