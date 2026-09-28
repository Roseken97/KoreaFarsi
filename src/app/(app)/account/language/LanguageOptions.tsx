"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckCircleIcon } from "@/components/icons";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "@/lib/i18n/client";
import { LOCALES, type Locale } from "@/lib/i18n/config";

const NATIVE: Record<Locale, { name: string; hint: string; dir: "ltr" | "rtl" }> = {
  en: { name: "한국어 · English", hint: "Left to right", dir: "ltr" },
  fa: { name: "한국어 · فارسی", hint: "راست به چپ", dir: "rtl" },
};

export function LanguageOptions() {
  const router = useRouter();
  const { locale, m } = useI18n();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <ul
      role="radiogroup"
      aria-label={m.language.label}
      className={`divide-y divide-line/70 overflow-hidden rounded-card bg-surface shadow-soft ${pending ? "opacity-60" : ""}`}
    >
      {LOCALES.map((l) => {
        const selected = l === locale;
        return (
          <li key={l}>
            <button
              role="radio"
              aria-checked={selected}
              onClick={() => choose(l)}
              className="flex w-full items-center gap-3 px-4 py-4 text-start transition hover:bg-cream/70"
            >
              <span lang={l} dir={NATIVE[l].dir} className="flex-1">
                <span className="block font-medium text-ink">{NATIVE[l].name}</span>
                <span className="block text-[13px] text-ink-soft">{NATIVE[l].hint}</span>
              </span>
              {selected ? (
                <CheckCircleIcon width={22} height={22} className="text-teal" />
              ) : (
                <span className="size-5 rounded-full border-2 border-line" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
