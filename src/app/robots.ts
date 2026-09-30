import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/** Keeps the admin form and API routes out of search results; everything else is public. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
