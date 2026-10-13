"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";

export type ShopCategory = "all" | Category;

/** Category chips; the choice lives in ?cat= so menu links and shared URLs open the right tab. */
export function ShopCategories({ categories }: { categories: ShopCategory[] }) {
  const { m } = useI18n();
  const active = useSearchParams().get("cat") ?? "all";
  return (
    <nav aria-label={m.shop.kicker} className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const selected = c === active || (c === "all" && !categories.includes(active as ShopCategory));
        return (
          <Link
            key={c}
            href={c === "all" ? "/shop" : `/shop?cat=${c}`}
            scroll={false}
            aria-current={selected ? "page" : undefined}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              selected ? "bg-white/90 text-[#1C1336]" : "border border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]"
            }`}
          >
            {m.shop.categories[c]}
          </Link>
        );
      })}
    </nav>
  );
}
