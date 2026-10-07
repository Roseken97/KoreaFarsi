import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import { SESSION_ONLY_COOKIE, applyRememberPolicy } from "./remember";

/** Routes that require a signed-in user. Everything else is open to guests. */
const PROTECTED_PREFIXES = ["/account", "/admin", "/library", "/planner"];

/** Auth pages a signed-in user has no reason to see. */
const GUEST_ONLY_PATHS = ["/auth/welcome", "/auth/login", "/auth/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

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
