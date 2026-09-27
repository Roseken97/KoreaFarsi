import type { Locale } from "@/lib/i18n/config";

export type Format = "pdf" | "physical";
export type Category = "course" | "book" | "planner" | "bundle" | "merch";
export type Collection = "alphabet" | "four_skills" | "workbook" | "planner" | "merch";

/** Mirrors public.products (supabase/migrations/0003_products.sql). */
export type Product = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  category: Category;
  collection: Collection | null;
  level: string | null;
  price: number;
  prices: Partial<Record<Format, number>>;
  compare_at_prices: Partial<Record<Format, number>>;
  currency: string;
  cover_image_url: string | null;
  format: Format[];
  bundle_items: string[];
  is_available: boolean;
  is_coming_soon: boolean;
  is_featured: boolean;
  sort_order: number;
  is_sample: boolean;
};

export function priceFor(p: Product, format: Format) {
  return p.prices[format] ?? p.price;
}

export function compareAtFor(p: Product, format: Format) {
  const c = p.compare_at_prices[format];
  return c && c > priceFor(p, format) ? c : null;
}

export function lowestPrice(p: Product) {
  return p.format.length ? Math.min(...p.format.map((f) => priceFor(p, f))) : p.price;
}

export function discountPercent(p: Product, format: Format) {
  const c = compareAtFor(p, format);
  return c ? Math.round((1 - priceFor(p, format) / c) * 100) : 0;
}

export function isPurchasable(p: Product) {
  return p.is_available && !p.is_coming_soon;
}

/** Primary title in the UI language; the other language is shown as a subtitle. */
export function titles(p: Product, locale: Locale) {
  const fa = p.title;
  const en = p.title_en || p.title;
  return locale === "fa" ? { primary: fa, secondary: p.title_en } : { primary: en, secondary: p.title_en ? fa : null };
}

export function descriptionOf(p: Product, locale: Locale) {
  return (locale === "en" ? p.description_en : p.description) || p.description || p.description_en || "";
}
