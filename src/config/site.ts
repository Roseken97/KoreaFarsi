/**
 * Canonical public address. Used for absolute URLs in metadata (link previews),
 * robots.txt and sitemap.xml. Auth redirects deliberately do NOT use this —
 * they follow the request origin so preview deployments keep working.
 */
export const SITE_URL = "https://koreafarsi.ir";
