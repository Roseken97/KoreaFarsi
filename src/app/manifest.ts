import type { MetadataRoute } from "next";

/** Web App Manifest — makes the site installable ("Add to Home Screen") as a standalone app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "KoreaFarsi — کوریافارسی",
    short_name: "KoreaFarsi",
    description: "A Bridge to a Brighter You — learn Korean with a path designed for Persian speakers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf6ef",
    theme_color: "#faf6ef",
    lang: "en",
    dir: "auto",
    categories: ["education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
