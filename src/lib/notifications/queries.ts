import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AppNotification } from "./types";

export async function getMyNotifications(): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  if (error) {
    console.error("[notifications] list:", error.message);
    return [];
  }
  return (data ?? []) as AppNotification[];
}

/** Unread count for the bell badge on Home/Account. */
export async function getUnreadNotificationCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return 0;
  const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false);
  return count ?? 0;
}
