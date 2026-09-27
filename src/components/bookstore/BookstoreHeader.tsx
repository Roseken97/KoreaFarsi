"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ChevronIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/client";
import { CartLink } from "./CartLink";

const iconBtn =
  "grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft transition hover:text-ink";

/** Sketch 13 header: Back · logo · search · cart. Search expands in place. */
export function BookstoreHeader({
  backHref,
  query,
  onQueryChange,
  searchOpen,
  onSearchOpenChange,
  extra,
}: {
  backHref: string;
  query?: string;
  onQueryChange?: (q: string) => void;
  searchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
  extra?: ReactNode;
}) {
  const { m } = useI18n();
  const t = m.bookstore;
  const inputRef = useRef<HTMLInputElement>(null);
  const canSearch = Boolean(onQueryChange && onSearchOpenChange);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="mb-6 flex items-center gap-2">
      <Link href={backHref} aria-label={t.back} className={iconBtn}>
        <ChevronIcon width={18} height={18} className="rotate-180" />
      </Link>

      {searchOpen && canSearch ? (
        <div className="relative flex-1">
          <SearchIcon width={18} height={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQueryChange!(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            className="h-10 w-full rounded-full border border-line bg-surface ps-10 pe-4 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/15"
          />
        </div>
      ) : (
        <Link href="/home" className="mx-auto md:mx-0 md:me-auto md:invisible" aria-label="KoreaFarsi">
          <Logo size={32} />
        </Link>
      )}

      {canSearch && (
        <button
          type="button"
          onClick={() => {
            if (searchOpen) onQueryChange!("");
            onSearchOpenChange!(!searchOpen);
          }}
          aria-label={searchOpen ? t.closeSearch : t.search}
          className={iconBtn}
        >
          {searchOpen ? <CloseIcon width={18} height={18} /> : <SearchIcon width={18} height={18} />}
        </button>
      )}
      {extra}
      <CartLink />
    </header>
  );
}
