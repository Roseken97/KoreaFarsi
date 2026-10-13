import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/bookstore/catalog";
import { getCourses } from "@/lib/courses/queries";
import { getKoreaLifePosts } from "@/lib/korealife/queries";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import { SITE_URL, langUrl } from "@/lib/seo";

/** Rebuilt hourly so new courses, products and posts reach Google without a redeploy. */
export const revalidate = 3600;

/**
 * Every public, indexable, canonical page, with its Persian and English versions linked as hreflang alternates.
 * App-shell duplicates (/bookstore, /korea-life) canonicalise to /shop and /magazine, and the in-app
 * /courses list is noindex, so none of those are listed here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allProducts, courses, posts] = await Promise.all([getProducts(), getCourses(), getKoreaLifePosts()]);
  // Sample/demo rows are placeholder content and must never reach Google.
  const products = allProducts.filter((p) => !p.is_sample);
  const hasBooks = products.some((p) => p.category === "book" || p.category === "bundle");
  const hasCourses = products.some((p) => p.category === "course");

  // Each language version is its own <url>, and every entry lists the full hreflang set (Google's sitemap rule).
  const languages = (path: string) => ({
    fa: `${SITE_URL}${langUrl(path, "fa")}`,
    en: `${SITE_URL}${langUrl(path, "en")}`,
    "x-default": `${SITE_URL}${langUrl(path, DEFAULT_LOCALE)}`,
  });
  const entry = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly"): MetadataRoute.Sitemap =>
    [DEFAULT_LOCALE, ...LOCALES.filter((l) => l !== DEFAULT_LOCALE)].map((locale) => ({
      url: `${SITE_URL}${langUrl(path, locale)}`,
      changeFrequency,
      // The Persian original is the primary audience; the English copy ranks a step lower.
      priority: locale === DEFAULT_LOCALE ? priority : Math.round(priority * 0.8 * 10) / 10,
      alternates: { languages: languages(path) },
    }));

  return [
    ...entry("/", 1, "weekly"),
    // Listings are left out (and noindex) while empty; they appear as soon as they have items.
    ...(products.length > 0 ? entry("/shop", 0.9, "weekly") : []),
    ...(hasBooks ? entry("/shop/books", 0.9, "weekly") : []),
    ...(hasCourses ? entry("/shop/courses", 0.9, "weekly") : []),
    ...(posts.length > 0 ? entry("/magazine", 0.7, "weekly") : []),
    ...entry("/about", 0.7, "monthly"),
    ...entry("/teacher", 0.6, "monthly"),
    ...entry("/app", 0.6, "monthly"),
    ...entry("/tools/dictionary", 0.5, "monthly"),
    ...entry("/contact", 0.5, "monthly"),
    ...entry("/faq", 0.6, "monthly"),
    ...entry("/terms", 0.3, "monthly"),
    ...courses.flatMap((c) => entry(`/courses/${c.slug}`, 0.8, "monthly")),
    ...products.flatMap((p) => entry(`/shop/${p.slug}`, 0.8, "monthly")),
    ...posts.flatMap((p) => entry(`/magazine/${p.slug}`, 0.6, "monthly")),
  ];
}
