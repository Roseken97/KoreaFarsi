import { fmt, formatNumber, type Locale, type Messages } from "@/lib/i18n/config";

export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(m: Messages, email: string) {
  if (!email.trim()) return m.errors.validation.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return m.errors.validation.emailInvalid;
  return "";
}

export function validatePassword(m: Messages, locale: Locale, password: string) {
  if (!password) return m.errors.validation.passwordRequired;
  if (password.length < MIN_PASSWORD_LENGTH)
    return fmt(m.errors.validation.passwordMin, { n: formatNumber(MIN_PASSWORD_LENGTH, locale) });
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return m.errors.validation.passwordComplex;
  return "";
}

/** Only allow same-origin relative paths as post-auth redirect targets. */
export function safeNext(next: string | null | undefined, fallback = "/home") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
