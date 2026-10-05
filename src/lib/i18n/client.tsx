"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { applyOverrides, type CopyOverrides } from "@/lib/site-copy/entries";
import { MESSAGES, dirOf, type Locale, type Messages } from "./config";

const I18nContext = createContext<{ locale: Locale; m: Messages }>({ locale: "en", m: MESSAGES.en });

/** `overrides` are the /admin/content edits for this locale, applied over the copy in code. */
export function I18nProvider({ locale, overrides, children }: { locale: Locale; overrides?: CopyOverrides; children: ReactNode }) {
  const value = useMemo(() => ({ locale, m: applyOverrides(MESSAGES[locale], overrides ?? {}) }), [locale, overrides]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const { locale, m } = useContext(I18nContext);
  return { locale, dir: dirOf(locale), m };
}
