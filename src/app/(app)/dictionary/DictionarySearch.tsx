"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/client";

const RECENT_KEY = "kf_dictionary_recent";
const MAX_RECENT = 8;

function naverUrl(query: string) {
  return `https://ko.dict.naver.com/#/search?query=${encodeURIComponent(query)}`;
}

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function DictionarySearch() {
  const { m } = useI18n();
  const t = m.dictionaryPage;
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // Hydrate after mount (localStorage is browser-only); keeps SSR markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(loadRecent());
  }, []);

  function search(word: string) {
    const trimmed = word.trim();
    if (!trimmed) return;
    window.open(naverUrl(trimmed), "_blank", "noopener,noreferrer");
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // best-effort only (e.g. private browsing)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    search(query);
  }

  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // best-effort only
    }
  }

  return (
    <div className="mt-6">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon width={18} height={18} className="pointer-events-none absolute inset-y-0 start-4 my-auto text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            dir="auto"
            className="h-13 w-full rounded-field border border-line bg-surface ps-11 pe-4 text-[15px] text-ink outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
          />
        </div>
        <Button type="submit" className="w-auto! px-6">
          {t.search}
        </Button>
      </form>
      <p className="mt-2 text-xs text-ink-faint">{t.hint}</p>

      {recent.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-soft">{t.recent}</h2>
            <button onClick={clearRecent} className="text-xs font-medium text-ink-faint hover:text-danger">
              {t.clear}
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {recent.map((word) => (
              <li key={word}>
                <button
                  onClick={() => search(word)}
                  dir="auto"
                  className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
