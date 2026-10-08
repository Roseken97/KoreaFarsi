import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import { SESSION_ONLY_COOKIE, applyRememberPolicy } from "./remember";

/** Routes that require a signed-in user. Everything else is open to guests. */
const PROTECTED_PREFIXES = ["/account", "/admin", "/library", "/planner"];

/** Auth pages a signed-in user has no reason to see. */
const GUEST_ONLY_PATHS = ["/auth/welcome", "/auth/login", "/auth/signup"];

const ADMIN_MFA_PATH = "/admin/mfa";

// Mirrors LOCALE_COOKIE / LOCALES in lib/i18n/config (not imported: that module pulls in every message file).
const LOCALE_COOKIE = "kf_locale";
const isLocale = (v: string | null): v is "en" | "fa" => v === "en" || v === "fa";

export async function updateSession(request: NextRequest) {
  // `?lang=fa|en` picks the UI language for this and later visits (crawlers rely on it,
  // since they never keep the cookie).
  const lang = request.nextUrl.searchParams.get("lang");
  if (isLocale(lang)) request.cookies.set(LOCALE_COOKIE, lang);

  let response = NextResponse.next({ request });
  if (isLocale(lang)) response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });

  // Supabase falls back to the Site URL (the marketing page) when the
  // requested redirectTo isn't on its allow list, so an OAuth code can land on
  // "/". Hand it to the auth callback so the user ends up in the app.
  const { pathname: path, searchParams } = request.nextUrl;
  if (path === "/" && searchParams.has("code")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!searchParams.has("next")) url.searchParams.set("next", "/home");
    return NextResponse.redirect(url);
  }

  if (!isSupabaseConfigured) return response;

  const sessionOnly = request.cookies.get(SESSION_ONLY_COOKIE)?.value === "1";

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        if (isLocale(lang)) response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, applyRememberPolicy(options, sessionOnly)),
        );
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Refreshes an expired session. Must run before any redirect decision.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!isSignedIn && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return redirectPreservingCookies(request, response, "/auth/login", pathname);
  }

  // Admins finish the second factor (authenticator code) before any /admin page.
  // Pages and actions re-check this through getAdminUser(); this only sends them to the right screen.
  if (isSignedIn && pathname.startsWith("/admin") && !pathname.startsWith(ADMIN_MFA_PATH) && process.env.ADMIN_MFA !== "off") {
    const email = String(data?.claims?.email ?? "").toLowerCase();
    const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    if (email && admins.includes(email) && data?.claims?.aal !== "aal2") {
      return redirectPreservingCookies(request, response, ADMIN_MFA_PATH, pathname);
    }
  }

  if (isSignedIn && GUEST_ONLY_PATHS.includes(pathname)) {
    return redirectPreservingCookies(request, response, "/home");
  }

  return response;
}

function redirectPreservingCookies(
  request: NextRequest,
  response: NextResponse,
  to: string,
  next?: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = to;
  url.search = next ? `?next=${encodeURIComponent(next)}` : "";
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
