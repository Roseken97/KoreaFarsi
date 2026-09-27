"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "@/components/icons";
import { useCart } from "@/lib/bookstore/cart";
import { formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

/** Header cart icon with item-count badge. */
export function CartLink() {
  const { m, locale } = useI18n();
  const { count, hydrated } = useCart();
  const label = hydrated && count > 0 ? `${m.bookstore.cartLabel} (${formatNumber(count, locale)})` : m.bookstore.cartLabel;

  return (
    <Link
      href="/bookstore/cart"
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft transition hover:text-ink"
    >
      <ShoppingBagIcon width={20} height={20} />
      {hydrated && count > 0 && (
        <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-blush px-1 text-[10px] leading-5 font-bold text-white">
          {formatNumber(count, locale)}
        </span>
      )}
    </Link>
  );
}
