import type { CookieOptions } from "@supabase/ssr";

/**
 * "Remember me" off → auth cookies become browser-session cookies (cleared
 * when the browser closes). The choice is stored in this marker cookie, which
 * is itself session-scoped, and every Supabase client (browser, server,
 * proxy) applies it when writing auth cookies.
 */
export const SESSION_ONLY_COOKIE = "kf_session_only";

export function applyRememberPolicy(options: CookieOptions, sessionOnly: boolean): CookieOptions {
  // Deletions (maxAge 0) must keep their expiry, or the cookie would never be removed.
  if (!sessionOnly || !options.maxAge) return options;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { maxAge, expires, ...rest } = options;
  return rest;
}
