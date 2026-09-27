import type { Messages } from "@/lib/i18n/config";

/** Maps a Supabase Auth error to a localized, user-facing message. */
export function authErrorMessage(m: Messages, error: { code?: string; message?: string } | null | undefined) {
  if (!error) return "";
  if (error.code && m.errors.codes[error.code]) return m.errors.codes[error.code];
  if (error.message?.toLowerCase().includes("fetch")) return m.errors.network;
  return m.errors.generic;
}
