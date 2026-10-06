"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/bookstore/format";
import { compareAtFor, isPurchasable, priceFor, type Format, type Product } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";
import { AddToCartButton } from "./AddToCartButton";

/** "Choose Format → Add to Cart" step of the sketch 13 user flow. */
export function ProductPurchase({ product }: { product: Product }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const [format, setFormat] = useState<Format>(product.format[0] ?? "pdf");
  const purchasable = isPurchasable(product);

  return (
    <div className="flex flex-col gap-4">
      {product.format.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">{t.product.chooseFormat}</legend>
          <div className="grid gap-2">
            {product.format.map((f) => {
              const selected = f === format;
              const compareAt = compareAtFor(product, f);
              return (
                <label
                  key={f}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-field border px-4 py-3 transition ${
                    selected ? "border-ink bg-surface ring-2 ring-ink/10" : "border-line bg-surface/60 hover:border-ink/30"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="format"
                      value={f}
                      checked={selected}
                      onChange={() => setFormat(f)}
                      className="size-4 accent-ink"
                    />
                    <span className="text-sm font-medium text-ink">{t.formatsLong[f]}</span>
                  </span>
                  <span className="text-end">
                    {compareAt && <span className="block text-[11px] text-ink-faint line-through">{formatPrice(compareAt, locale, m)}</span>}
                    <span className="text-sm font-semibold text-ink">{formatPrice(priceFor(product, f), locale, m)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {purchasable ? (
        <AddToCartButton slug={product.slug} format={format} />
      ) : (
        <p className="rounded-field bg-cream-deep px-4 py-3 text-sm leading-6 text-ink-soft">{t.product.comingSoonNote}</p>
      )}
    </div>
  );
}
