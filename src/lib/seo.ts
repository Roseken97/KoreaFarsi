import type { Metadata } from "next";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** The production origin, used for canonical links, the sitemap and Open Graph. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://koreafarsi.ir").replace(/\/$/, "");

/** Brand identity shared by metadata, JSON-LD and the manifest — change it here, not per page. */
export const BRAND = {
  name: "KoreaFarsi",
  nameFa: "کوریافارسی",
  /** Spellings people actually search for; used as schema.org alternateName. */
  alternateNames: ["کوریافارسی", "کوریا فارسی", "Korea Farsi"],
  /** Real logo file in /public (512×512 PNG). */
  logoPath: "/brand/logo-512.png",
  /** Site-wide share image (src/app/opengraph-image.jpg, 1200×630) and its alt text file. */
  shareImage: { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "KoreaFarsi — learn Korean in Persian, from Hangul to conversation" },
} as const;

export function siteNameOf(locale: Locale) {
  return locale === "fa" ? BRAND.nameFa : BRAND.name;
}

/**
 * Non-production deployments (Vercel previews, a staging host) must never be indexed,
 * or Google sees a second copy of the site. Vercel sets VERCEL_ENV; SITE_NOINDEX=1 covers other hosts.
 */
export const IS_INDEXABLE_DEPLOYMENT =
  process.env.SITE_NOINDEX !== "1" && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

/** For signed-in, utility and duplicate pages: keep them out of results but let link equity flow. */
export const NOINDEX: Metadata["robots"] = { index: false, follow: true };

/**
 * The UI language lives in a cookie, which crawlers don't send, so a bare URL renders in
 * DEFAULT_LOCALE (Persian). The other language gets its own crawlable URL via `?lang=`
 * (the proxy turns it into the cookie), which hreflang points at.
 */
export function langUrl(path: string, locale: Locale) {
  return locale === DEFAULT_LOCALE ? path : `${path}?lang=${locale}`;
}

/** canonical + hreflang links for a public page shown in `locale`. */
export function localeAlternates(path: string, locale: Locale): Metadata["alternates"] {
  return {
    canonical: langUrl(path, locale),
    languages: { fa: langUrl(path, "fa"), en: langUrl(path, "en"), "x-default": langUrl(path, DEFAULT_LOCALE) },
  };
}

type PageMetaInput = {
  locale: Locale;
  /** The URL path this page is canonically served at, e.g. "/about" or `/shop/${slug}`. */
  path: string;
  title: string;
  description?: string;
  /** Use the title as-is (no "| کوریافارسی" suffix) — for the homepage. */
  absoluteTitle?: boolean;
  /** A page-specific share image (absolute URL or path). Omit to use the site-wide share image. */
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
};

/**
 * One place that builds a public page's title, description, canonical/hreflang, Open Graph
 * and Twitter card. Next merges metadata shallowly, so a page that sets only `title` would
 * otherwise share the homepage's og:title/og:description and have no og:url.
 */
export function pageMetadata({ locale, path, title, description, absoluteTitle, image, imageAlt, type = "website", robots }: PageMetaInput): Metadata {
  const siteName = siteNameOf(locale);
  const shareTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  const url = langUrl(path, locale);
  // A page that sets `openGraph` loses the inherited file-based opengraph-image, so always name one explicitly.
  const images = image ? [{ url: image, ...(imageAlt ? { alt: imageAlt } : {}) }] : [BRAND.shareImage];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    ...(description ? { description } : {}),
    alternates: localeAlternates(path, locale),
    openGraph: {
      type,
      url,
      siteName,
      title: shareTitle,
      ...(description ? { description } : {}),
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      ...(description ? { description } : {}),
      images,
    },
    ...(robots ? { robots } : {}),
  };
}

/** Trims text to a search-snippet length on a word boundary. */
export function snippet(text: string | null | undefined, max = 160) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean || undefined;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6))}…`;
}

/** schema.org BreadcrumbList from [name, path] pairs, in the page's language. */
export function breadcrumbJsonLd(locale: Locale, items: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${langUrl(path, locale)}` })),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
