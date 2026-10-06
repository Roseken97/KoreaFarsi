"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { SITE_COPY_TAG } from "@/lib/site-copy/queries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CARD_IMAGE_LOCALE, CARD_IMAGE_PREFIX, isCardImageSlot, pickCardImages, type CardImages } from "./slots";

export type CardImageResult = { ok: true } | { ok: false; error: "forbidden" | "slot" | "generic" };

async function guard() {
  const admin = await getAdminUser();
  const store = supabaseAdmin();
  return admin && store ? { admin, store } : null;
}

/** Fresh (uncached) photos for the editor. */
export async function listCardImagesAdmin(): Promise<CardImages> {
  const g = await guard();
  if (!g) return {};
  const { data, error } = await g.store.from("site_copy").select("key, value").eq("locale", CARD_IMAGE_LOCALE).like("key", `${CARD_IMAGE_PREFIX}%`);
  if (error) {
    console.error("[admin/card-images] list:", error.message);
    return {};
  }
  return pickCardImages(Object.fromEntries((data ?? []).map((r) => [r.key, r.value])));
}

/** Sets a card's photo, or clears it (null) so the plain color card shows again. */
export async function saveCardImage(slot: string, url: string | null): Promise<CardImageResult> {
  const g = await guard();
  if (!g) return { ok: false, error: "forbidden" };
  if (!isCardImageSlot(slot)) return { ok: false, error: "slot" };

  const key = CARD_IMAGE_PREFIX + slot;
  const { error } = url
    ? await g.store.from("site_copy").upsert({ key, locale: CARD_IMAGE_LOCALE, value: url, updated_at: new Date().toISOString(), updated_by: g.admin.id })
    : await g.store.from("site_copy").delete().eq("key", key).eq("locale", CARD_IMAGE_LOCALE);
  if (error) {
    console.error("[admin/card-images] save:", error.message);
    return { ok: false, error: "generic" };
  }
  updateTag(SITE_COPY_TAG);
  revalidatePath("/", "layout");
  return { ok: true };
}
