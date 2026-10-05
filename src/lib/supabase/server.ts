import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import { SESSION_ONLY_COOKIE, applyRememberPolicy } from "./remember";

/**
 * Memoized per request (React's request cache): without this, every call site
 * (getCurrentUser, getActivePlan, getProfile, …) built its own GoTrueClient from
 * the same cookies, so a page like the Planner — which fetches several of these
 * concurrently via Promise.all — could fire several independent token-refresh
 * attempts at once. Supabase refresh tokens are single-use, so a concurrent
 * second refresh fails with "Already Used" and throws uncaught. One shared
 * client per request serializes those calls through supabase-js's own lock.
 */
export const createClient = cache(async function createClient() {
  const cookieStore = await cookies();
  const sessionOnly = cookieStore.get(SESSION_ONLY_COOKIE)?.value === "1";

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, applyRememberPolicy(options, sessionOnly)),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
});

/** Returns the signed-in user, or null (also null when Supabase is not configured). Memoized per request. */
export const getCurrentUser = cache(async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});
