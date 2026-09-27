"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "@/lib/i18n/client";
import { LOCALES, type Locale } from "@/lib/i18n/config";

/** Segmented EN | فارسی control. Full language settings live in Account (Milestone 2). */
export function LanguageSwitch({ className = "" }: { className?: string }) {
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
    <div
      role="radiogroup"
      aria-label={m.language.label}
      className={`inline-flex rounded-full border border-line bg-surface p-1 text-xs font-medium ${pending ? "opacity-60" : ""} ${className}`}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={l === locale}
          onClick={() => choose(l)}
          lang={l}
          className={`rounded-full px-3 py-1.5 transition ${
            l === locale ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
          }`}
        >
          {m.language[l]}
        </button>
      ))}
    </div>
  );
}
