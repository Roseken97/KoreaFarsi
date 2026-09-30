import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/** Public, guest-accessible pages only; signed-in areas and admin stay out. */
const PUBLIC_PATHS = ["/", "/home", "/courses", "/bookstore", "/dictionary", "/korea-life", "/ai-hub", "/auth/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
