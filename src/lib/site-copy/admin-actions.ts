"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { copyEntries, isCopyKey, placeholdersOf, type CopyOverrides } from "./entries";
import { SITE_COPY_TAG } from "./queries";

export type CopyResult = { ok: true } | { ok: false; error: "forbidden" | "key" | "empty" | "placeholder" | "generic"; detail?: string };

async function guard() {
  const admin = await getAdminUser();
  const store = supabaseAdmin();
  return admin && store ? { admin, store } : null;
}

/** Fresh (uncached) overrides for the editor, both locales. */
export async function listCopyOverridesAdmin(): Promise<Record<Locale, CopyOverrides>> {
  const result: Record<Locale, CopyOverrides> = { en: {}, fa: {} };
  const g = await guard();
  if (!g) return result;
  const { data, error } = await g.store.from("site_copy").select("key, locale, value");
  if (error) {
    console.error("[admin/content] list:", error.message);
    return result;
  }
  for (const row of data ?? []) if (isLocale(row.locale)) result[row.locale][row.key] = row.value;
  return result;
}

function refresh() {
  updateTag(SITE_COPY_TAG);
  revalidatePath("/", "layout");
}

/** Saves the edited text for one string. Saving text identical to the default removes the override instead. */
export async function saveCopy(key: string, locale: string, value: string): Promise<CopyResult> {
  const g = await guard();
  if (!g) return { ok: false, error: "forbidden" };
  if (!isCopyKey(key) || !isLocale(locale)) return { ok: false, error: "key" };

  const text = value.trim();
  if (!text) return { ok: false, error: "empty" };

  const entry = copyEntries().find((e) => e.key === key)!;
  const fallback = entry[locale];
  // A placeholder the code doesn't fill would show up literally as "{x}" on the page.
  const known = placeholdersOf(fallback);
  const unknown = [...placeholdersOf(text)].filter((p) => !known.has(p));
  if (unknown.length) return { ok: false, error: "placeholder", detail: unknown.map((p) => `{${p}}`).join(", ") };

  const { error } =
    text === fallback
      ? await g.store.from("site_copy").delete().eq("key", key).eq("locale", locale)
      : await g.store.from("site_copy").upsert({ key, locale, value: text, updated_at: new Date().toISOString(), updated_by: g.admin.id });
  if (error) {
    console.error("[admin/content] save:", error.message);
    return { ok: false, error: "generic" };
  }
  refresh();
  return { ok: true };
}

/** Drops the override so the copy in code shows again. */
export async function resetCopy(key: string, locale: string): Promise<CopyResult> {
  const g = await guard();
  if (!g) return { ok: false, error: "forbidden" };
  if (!isLocale(locale)) return { ok: false, error: "key" };
  const { error } = await g.store.from("site_copy").delete().eq("key", key).eq("locale", locale);
  if (error) return { ok: false, error: "generic" };
  refresh();
  return { ok: true };
}
