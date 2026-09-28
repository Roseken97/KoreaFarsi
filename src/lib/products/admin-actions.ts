"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { hasServiceRole, supabaseAdmin } from "@/lib/supabase/admin";
import type { Category, Collection, Format, Product } from "@/lib/bookstore/types";

export type AdminResult = { ok: true } | { ok: false; error: "forbidden" | "slug" | "title" | "generic" };
export type UploadTicketResult =
  | { ok: true; path: string; token: string; bucket: "covers" | "library" }
  | { ok: false; error: "forbidden" | "generic" };

async function guard() {
  const [admin, store] = [await getAdminUser(), supabaseAdmin()];
  return admin && store ? store : null;
}

/** Full catalog (including unavailable/coming-soon rows) for the admin table. */
export async function listProductsAdmin(): Promise<Product[]> {
  const store = await guard();
  if (!store) return [];
  const { data, error } = await store.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/products] list:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

/**
 * A signed, one-time upload slot in Storage. The browser uploads the file
 * bytes straight to Supabase with this token (bypassing the Next.js server),
 * so large video files never hit a server-action body-size limit.
 */
export async function createUploadTicket(kind: "cover" | "digital", slug: string, fileName: string): Promise<UploadTicketResult> {
  if (!(await getAdminUser())) return { ok: false, error: "forbidden" };
  if (!hasServiceRole()) return { ok: false, error: "generic" };
  const admin = supabaseAdmin()!;

  const bucket = kind === "cover" ? "covers" : "library";
  const safeName = fileName.replace(/[^\w.\-]+/g, "_").slice(-120);
  const path = `${slug}/${Date.now()}-${safeName}`;

  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[admin/products] upload ticket:", error?.message);
    return { ok: false, error: "generic" };
  }
  return { ok: true, path: data.path, token: data.token, bucket };
}

export type ProductInput = {
  id: string | null;
  slug: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  category: Category;
  collection: Collection | "";
  level: string;
  price: number;
  currency: string;
  format: Format[];
  prices: Partial<Record<Format, number>>;
  compare_at_prices: Partial<Record<Format, number>>;
  bundle_items: string[];
  cover_image_url: string | null;
  digital_file_path: string | null;
  is_available: boolean;
  is_coming_soon: boolean;
  is_featured: boolean;
  sort_order: number;
};

export async function saveProduct(input: ProductInput): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };

  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  const title = input.title.trim();
  if (!slug) return { ok: false, error: "slug" };
  if (!title) return { ok: false, error: "title" };

  const row = {
    slug,
    title,
    title_en: input.title_en.trim() || null,
    description: input.description.trim() || null,
    description_en: input.description_en.trim() || null,
    category: input.category,
    collection: input.collection || null,
    level: input.level.trim() || null,
    price: input.price,
    currency: input.currency,
    format: input.format,
    prices: input.prices,
    compare_at_prices: input.compare_at_prices,
    bundle_items: input.bundle_items,
    cover_image_url: input.cover_image_url,
    digital_file_path: input.digital_file_path,
    is_available: input.is_available,
    is_coming_soon: input.is_coming_soon,
    is_featured: input.is_featured,
    sort_order: input.sort_order,
  };

  const { error } = input.id ? await store.from("products").update(row).eq("id", input.id) : await store.from("products").insert(row);
  if (error) {
    console.error("[admin/products] save:", error.message);
    return { ok: false, error: error.code === "23505" ? "slug" : "generic" };
  }
  revalidatePath("/admin/products");
  revalidatePath("/bookstore");
  return { ok: true };
}

/** For the bundle "included items" picker. */
export async function listProductSlugsAdmin(): Promise<{ slug: string; title: string }[]> {
  const store = await guard();
  if (!store) return [];
  const { data } = await store.from("products").select("slug, title").neq("category", "bundle").order("title", { ascending: true });
  return data ?? [];
}

export async function deleteProduct(id: string): Promise<AdminResult> {
  const store = await guard();
  if (!store) return { ok: false, error: "forbidden" };
  const { error } = await store.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: "generic" };
  revalidatePath("/admin/products");
  revalidatePath("/bookstore");
  return { ok: true };
}
