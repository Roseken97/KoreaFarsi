import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Announcement, AnnouncementPlacement } from "./types";

/** Every active banner for this Hero, in display order ("all" rows show everywhere too). Shown back-to-back in a carousel. */
export async function getActiveAnnouncements(placement: AnnouncementPlacement): Promise<Announcement[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .in("placement", placement === "all" ? ["all"] : ["all", placement])
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[announcements] active:", error.message);
    return [];
  }
  return (data ?? []) as Announcement[];
}
