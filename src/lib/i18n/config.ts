import { en, type Messages } from "./messages/en";
import { fa } from "./messages/fa";

export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];

/** Confirmed by Rose: English is the default UI language; Persian is selectable. */
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "kf_locale";

export const MESSAGES: Record<Locale, Messages> = { en, fa };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Layout direction stays LTR for every locale: switching language only
 * swaps text content, it never mirrors icons, nav, or spacing.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site compatibility
export function dirOf(_locale: Locale) {
  return "ltr";
}

/** Replaces `{key}` placeholders: fmt("Hi {name}", { name: "Rose" }). */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export function formatNumber(n: number, locale: Locale) {
  return n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
}

export type { Messages };
