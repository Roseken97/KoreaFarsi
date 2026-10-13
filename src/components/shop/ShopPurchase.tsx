"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, ShoppingBagIcon } from "@/components/icons";
import { useCart } from "@/lib/bookstore/cart";
import { formatPrice } from "@/lib/bookstore/format";
import { compareAtFor, isPurchasable, priceFor, type Format, type Product } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";

/** Choose a format and add it to the shared cart, in the website's style. */
export function ShopPurchase({ product }: { product: Product }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const { add } = useCart();
  const [format, setFormat] = useState<Format>(product.format[0] ?? "pdf");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2400);
    return () => clearTimeout(id);
  }, [added]);

  if (!isPurchasable(product)) {
    return <p className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-[#C9BEE3]">{t.product.comingSoonNote}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {product.format.length > 0 && (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm font-bold text-white">{t.product.chooseFormat}</legend>
          <div className="grid gap-2">
            {product.format.map((f) => {
              const selected = f === format;
              const compareAt = compareAtFor(product, f);
              return (
                <label
                  key={f}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                    selected ? "border-[#6FF3EE]/70 bg-white/[0.09]" : "border-white/15 bg-white/[0.03] hover:border-white/30"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" name="format" value={f} checked={selected} onChange={() => setFormat(f)} className="size-4 accent-[#2FE6E0]" />
                    <span className="text-sm font-bold text-white">{t.formatsLong[f]}</span>
                  </span>
                  <span className="text-end leading-tight">
                    {compareAt && <span className="block text-[11px] text-[#A99FC4] line-through">{formatPrice(compareAt, locale, m)}</span>}
                    <span className="text-sm font-extrabold text-[#6FF3EE]">{formatPrice(priceFor(product, f), locale, m)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        onClick={() => {
          add(product.slug, format);
          setAdded(true);
        }}
        className={`flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-7 text-[16px] font-extrabold transition ${
          added ? "bg-[#2FE6E0] text-[#1C1336]" : "bg-white/90 text-[#1C1336] hover:bg-white"
        }`}
      >
        {added ? <CheckIcon width={20} height={20} /> : <ShoppingBagIcon width={20} height={20} />}
        <span aria-live="polite">{added ? t.added : t.addToCart}</span>
      </button>
      {added && (
        <Link href="/shop/cart" className="text-center text-sm font-bold text-[#6FF3EE] hover:text-white">
          {t.cartLabel}
        </Link>
      )}
    </div>
  );
}
