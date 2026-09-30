"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { KoreaLifeCategory, KoreaLifePost } from "./types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "slug" | "title" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

export async function listKoreaLifePostsAdmin(): Promise<KoreaLifePost[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store.from("korea_life_posts").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/korea-life] list:", error.message);
    return [];
  }
  return (data ?? []) as KoreaLifePost[];
}

export type PostInput = {
  id: string | null;
  slug: string;
  category: KoreaLifeCategory;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  body: string;
  body_en: string;
  cover_image_url: string | null;
  is_available: boolean;
  sort_order: number;
};

export async function savePost(input: PostInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  const title = input.title.trim();
  if (!slug) return { ok: false, error: "slug" };
  if (!title) return { ok: false, error: "title" };

  const row = {
    slug,
    category: input.category,
    title,
    title_en: input.title_en.trim() || null,
    excerpt: input.excerpt.trim() || null,
    excerpt_en: input.excerpt_en.trim() || null,
    body: input.body.trim() || null,
    body_en: input.body_en.trim() || null,
    cover_image_url: input.cover_image_url,
    is_available: input.is_available,
    sort_order: input.sort_order,
  };

  const { error } = input.id ? await store.from("korea_life_posts").update(row).eq("id", input.id) : await store.from("korea_life_posts").insert(row);
  if (error) return { ok: false, error: error.code === "23505" ? "slug" : "generic" };
  revalidatePath("/admin/korea-life");
  revalidatePath("/korea-life");
  return { ok: true };
}

export async function deletePost(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("korea_life_posts").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/korea-life");
  revalidatePath("/korea-life");
  return { ok: true };
}
