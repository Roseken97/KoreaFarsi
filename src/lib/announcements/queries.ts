import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Announcement, AnnouncementPlacement } from "./types";

/** The one banner to show in a Hero for this placement, if any ("all" rows show everywhere). */
export async function getActiveAnnouncement(placement: AnnouncementPlacement): Promise<Announcement | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .in("placement", placement === "all" ? ["all"] : ["all", placement])
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[announcements] active:", error.message);
    return null;
  }
  return (data ?? null) as Announcement | null;
}
