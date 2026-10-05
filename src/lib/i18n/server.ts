import { cookies } from "next/headers";
import { cache } from "react";
import { applyOverrides } from "@/lib/site-copy/entries";
import { getCopyOverrides } from "@/lib/site-copy/queries";
import { DEFAULT_LOCALE, LOCALE_COOKIE, MESSAGES, isLocale, type Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** The copy in code with any /admin/content edits applied. Memoized per request. */
export const getMessages = cache(async function getMessages() {
  const locale = await getLocale();
  return { locale, m: applyOverrides(MESSAGES[locale], await getCopyOverrides(locale)) };
});
