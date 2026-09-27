import { createBrowserClient } from "@supabase/ssr";
import { parseCookie, stringifySetCookie } from "cookie";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";
import { SESSION_ONLY_COOKIE, applyRememberPolicy } from "./remember";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(parseCookie(document.cookie)).map(([name, value]) => ({ name, value: value ?? "" }));
      },
      setAll(cookiesToSet) {
        const sessionOnly = parseCookie(document.cookie)[SESSION_ONLY_COOKIE] === "1";
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = stringifySetCookie({ name, value, ...applyRememberPolicy(options, sessionOnly) });
        });
      },
    },
  });
}

/** Call before signing in with the "Remember me" choice. */
export function setRememberMe(remember: boolean) {
  document.cookie = remember
    ? stringifySetCookie({ name: SESSION_ONLY_COOKIE, value: "", path: "/", maxAge: 0 })
    : stringifySetCookie({ name: SESSION_ONLY_COOKIE, value: "1", path: "/", sameSite: "lax" });
}
