"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";

/** Site version of the app's dictionary box: hands the word to Naver's dictionary in a new tab. */
export function SiteDictionary() {
  const { m } = useI18n();
  const t = m.dictionaryPage;
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const word = query.trim();
    if (!word) return;
    window.open(`https://en.dict.naver.com/#/search?query=${encodeURIComponent(word)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} role="search" className="mt-6 flex w-full max-w-[640px] items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] p-1.5 ps-5 backdrop-blur-md focus-within:border-[#2FE6E0]">
      <SearchIcon width={20} height={20} className="shrink-0 text-[#A99FC4]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        dir="auto"
        className="min-w-0 flex-1 bg-transparent py-2.5 text-[16px] text-white outline-none placeholder:text-[#A99FC4]"
      />
      <button type="submit" className="shrink-0 rounded-full bg-white/90 px-6 py-2.5 text-sm font-extrabold text-[#1C1336] hover:bg-white">
        {t.search}
      </button>
    </form>
  );
}
