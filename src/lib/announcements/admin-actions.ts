"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Announcement, AnnouncementPlacement } from "./types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "title" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

export async function listAnnouncementsAdmin(): Promise<Announcement[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store.from("announcements").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/announcements] list:", error.message);
    return [];
  }
  return (data ?? []) as Announcement[];
}

export type AnnouncementInput = {
  id: string | null;
  placement: AnnouncementPlacement;
  title: string;
  title_en: string;
  body: string;
  body_en: string;
  href: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

function revalidateAll() {
  revalidatePath("/admin/announcements");
  revalidatePath("/home");
  revalidatePath("/courses");
}

export async function saveAnnouncement(input: AnnouncementInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "title" };

  const row = {
    placement: input.placement,
    title,
    title_en: input.title_en.trim() || null,
    body: input.body.trim() || null,
    body_en: input.body_en.trim() || null,
    href: input.href.trim() || null,
    image_url: input.image_url,
    is_active: input.is_active,
    sort_order: input.sort_order,
  };

  const { error } = input.id ? await store.from("announcements").update(row).eq("id", input.id) : await store.from("announcements").insert(row);
  if (error) return { ok: false, error: "generic" };
  revalidateAll();
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("announcements").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidateAll();
  return { ok: true };
}
