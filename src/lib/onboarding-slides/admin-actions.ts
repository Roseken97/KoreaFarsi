"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_SLIDES } from "./defaults";
import { SLIDE_COLOR_KEYS, type OnboardingSlideRow, type SlideColor } from "./types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "title" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

function revalidateAll() {
  revalidatePath("/admin/onboarding");
  revalidatePath("/onboarding");
}

export async function listOnboardingSlidesAdmin(): Promise<OnboardingSlideRow[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store
    .from("onboarding_slides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[admin/onboarding] list:", error.message);
    return [];
  }
  return (data ?? []) as OnboardingSlideRow[];
}

export type SlideInput = {
  id: string | null;
  color: SlideColor;
  badge: string;
  title: string;
  title_accent: string;
  body: string;
  title_en: string;
  title_accent_en: string;
  body_en: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function saveOnboardingSlide(input: SlideInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "title" };

  const row = {
    color: SLIDE_COLOR_KEYS.includes(input.color) ? input.color : "peach",
    badge: input.badge.trim() || null,
    title,
    title_accent: input.title_accent.trim() || null,
    body: input.body.trim() || null,
    title_en: input.title_en.trim() || null,
    title_accent_en: input.title_accent_en.trim() || null,
    body_en: input.body_en.trim() || null,
    image_url: input.image_url,
    is_active: input.is_active,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
  };

  const { error } = input.id
    ? await store.from("onboarding_slides").update(row).eq("id", input.id)
    : await store.from("onboarding_slides").insert(row);
  if (error) {
    console.error("[admin/onboarding] save:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAll();
  return { ok: true };
}

export async function deleteOnboardingSlide(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("onboarding_slides").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidateAll();
  return { ok: true };
}

/** Copies the built-in slides into the table so they can be edited one by one. */
export async function seedDefaultSlides(): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const rows = DEFAULT_SLIDES.map((s, i) => ({
    sort_order: (i + 1) * 10,
    color: s.color,
    badge: s.badge,
    title: s.fa.title,
    title_accent: s.fa.accent,
    body: s.fa.body,
    title_en: s.en.title,
    title_accent_en: s.en.accent,
    body_en: s.en.body,
    image_url: s.image,
  }));
  const { error } = await store.from("onboarding_slides").insert(rows);
  if (error) {
    console.error("[admin/onboarding] seed:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAll();
  return { ok: true };
}
