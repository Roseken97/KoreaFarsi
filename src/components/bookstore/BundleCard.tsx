"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/bookstore/format";
import { compareAtFor, discountPercent, isPurchasable, priceFor, titles, type Format, type Product } from "@/lib/bookstore/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "./Badges";
import { ProductCover } from "./ProductCover";

/** Popular Bundles card (sketch 13 §7): horizontal, discount, Add to Cart. */
export function BundleCard({ product }: { product: Product }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const { primary, secondary } = titles(product, locale);
  // Show the cheapest format on the card; the product page lets the buyer switch.
  const format: Format = [...product.format].sort((a, b) => priceFor(product, a) - priceFor(product, b))[0] ?? "pdf";
  const price = priceFor(product, format);
  const compareAt = compareAtFor(product, format);
  const discount = discountPercent(product, format);

  return (
    <article className="flex gap-4 rounded-card border border-line/60 bg-gradient-to-br from-surface to-blush-soft/50 p-4 shadow-soft">
      <Link href={`/bookstore/${product.slug}`} className="w-24 shrink-0 md:w-28">
        <ProductCover product={product} sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          {discount > 0 && <Badge tone="discount">{fmt(t.off, { n: formatNumber(discount, locale) })}</Badge>}
          {product.is_coming_soon && <Badge tone="soon">{t.comingSoon}</Badge>}
          {product.is_sample && <Badge tone="sample">{t.sample}</Badge>}
        </div>
        <Link href={`/bookstore/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-2 font-display text-lg leading-snug font-semibold">{primary}</h3>
        </Link>
        {secondary && (
          <p className="line-clamp-1 text-[12px] text-ink-faint">
            <bdi>{secondary}</bdi>
          </p>
        )}
        <p className="mt-1 text-[12px] text-ink-soft">{t.formatsLong[format]}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            {compareAt && <p className="text-[11px] text-ink-faint line-through">{formatPrice(compareAt, locale, m)}</p>}
            <p className="font-semibold text-ink">{formatPrice(price, locale, m)}</p>
          </div>
          <div className="w-auto">
            <AddToCartButton slug={product.slug} format={format} compact disabled={!isPurchasable(product)} />
          </div>
        </div>
      </div>
    </article>
  );
}
