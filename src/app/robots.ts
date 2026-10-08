import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Public pages are crawlable; admin, API and signed-in-only areas stay out of search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/account", "/auth", "/library", "/planner", "/notifications", "/onboarding", "/bookstore/cart"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
