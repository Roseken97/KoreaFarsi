import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { Locale } from "@/lib/i18n/config";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CopyOverrides } from "./entries";

export const SITE_COPY_TAG = "site-copy";

/**
 * Every override, both locales. Cached across requests (the root layout reads it
 * on every page) and expired by the /admin/content actions via SITE_COPY_TAG;
 * the 5-minute revalidate is only a safety net. Cookie-free anon client, since
 * the table is public-read and cached data must not depend on the viewer.
 */
const loadAll = unstable_cache(
  async (): Promise<Record<Locale, CopyOverrides>> => {
    const result: Record<Locale, CopyOverrides> = { en: {}, fa: {} };
    if (!isSupabaseConfigured) return result;
    const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("site_copy").select("key, locale, value");
    if (error) {
      // Missing table (migration not run yet) or Supabase down: fall back to the copy in code.
      console.error("[site-copy] load:", error.message);
      return result;
    }
    for (const row of data ?? []) {
      if (row.locale === "en" || row.locale === "fa") result[row.locale as Locale][row.key] = row.value;
    }
    return result;
  },
  ["site-copy"],
  { tags: [SITE_COPY_TAG], revalidate: 300 },
);

/** Admin-edited copy for one locale (empty when nothing is edited or Supabase is unavailable). */
export const getCopyOverrides = cache(async (locale: Locale): Promise<CopyOverrides> => {
  try {
    return (await loadAll())[locale];
  } catch (err) {
    console.error("[site-copy] load:", err);
    return {};
  }
});
