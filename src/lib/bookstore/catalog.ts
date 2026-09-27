import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import samples from "./sample-products.json";
import type { Product } from "./types";

/**
 * Catalog source:
 * - Supabase connected → public.products (seed sample rows with supabase/seed/sample_products.sql).
 * - Not connected      → the bundled sample catalog, so the Bookstore can be reviewed offline.
 */
const SAMPLE_CATALOG: Product[] = (samples as Omit<Product, "id" | "currency" | "cover_image_url" | "is_sample">[]).map(
  (p) => ({ ...p, id: p.slug, currency: "IRT", cover_image_url: null, is_sample: true }) as Product,
);

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return SAMPLE_CATALOG;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[bookstore] failed to load products:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
