"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false };
  revalidatePath("/notifications");
  return { ok: true };
}

export async function markAllNotificationsRead(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  if (error) return { ok: false };
  revalidatePath("/notifications");
  return { ok: true };
}
