import type { Metadata } from "next";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** The production origin, used for canonical links, the sitemap and Open Graph. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://koreafarsi.ir").replace(/\/$/, "");

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
