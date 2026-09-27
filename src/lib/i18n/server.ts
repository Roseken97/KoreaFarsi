import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, MESSAGES, isLocale, type Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getMessages() {
  const locale = await getLocale();
  return { locale, m: MESSAGES[locale] };
}
