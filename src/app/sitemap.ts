import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/bookstore/catalog";
import { getCourses } from "@/lib/courses/queries";
import { getKoreaLifePosts } from "@/lib/korealife/queries";
import { SITE_URL, langUrl } from "@/lib/seo";

/** Every public page, with its Persian and English versions linked as hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, courses, posts] = await Promise.all([getProducts(), getCourses(), getKoreaLifePosts()]);

  const entry = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly"): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
    alternates: { languages: { fa: `${SITE_URL}${langUrl(path, "fa")}`, en: `${SITE_URL}${langUrl(path, "en")}` } },
  });

  return [
    entry("/", 1, "weekly"),
    entry("/courses", 0.9, "weekly"),
    entry("/bookstore", 0.9, "weekly"),
    entry("/korea-life", 0.7, "weekly"),
    ...courses.map((c) => entry(`/courses/${c.slug}`, 0.8, "monthly")),
    ...products.map((p) => entry(`/bookstore/${p.slug}`, 0.8, "monthly")),
    ...posts.map((p) => entry(`/korea-life/${p.slug}`, 0.6, "monthly")),
  ];
}
