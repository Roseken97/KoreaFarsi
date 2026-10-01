"use client";

import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { MotionSurface } from "@/components/motion/MotionCard";
import { formatPrice, levelLabel } from "@/lib/bookstore/format";
import { compareAtFor, discountPercent, isPurchasable, lowestPrice, titles, type Product } from "@/lib/bookstore/types";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { AddToCartButton } from "./AddToCartButton";
import { Badge } from "./Badges";
import { ProductCover } from "./ProductCover";

/**
 * Featured-book card (sketch 13 §6): cover, title (both languages), level,
 * format badges, price, cart button. Single-format items add straight to the
 * cart; multi-format items open the product page to choose a format first.
 */
export function ProductCard({ product }: { product: Product }) {
  const { m, locale } = useI18n();
  const t = m.bookstore;
  const { primary, secondary } = titles(product, locale);
  const href = `/bookstore/${product.slug}`;
  const single = product.format.length === 1 ? product.format[0] : null;
  const price = lowestPrice(product);
  const discount = single ? discountPercent(product, single) : 0;
  const compareAt = single ? compareAtFor(product, single) : null;
  const level = levelLabel(product.level, m);

  return (
    <MotionSurface className="group relative flex flex-col rounded-card border border-line/60 bg-surface p-3 shadow-soft transition hover:shadow-lift">
      <Link href={href} className="relative block">
        <ProductCover product={product} sizes="(min-width: 1024px) 220px, 45vw" />
        <span className="absolute start-2 top-2 flex flex-col items-start gap-1">
          {product.is_coming_soon && <Badge tone="soon">{t.comingSoon}</Badge>}
          {discount > 0 && <Badge tone="discount">{fmt(t.off, { n: formatNumber(discount, locale) })}</Badge>}
        </span>
        {product.is_sample && (
          <span className="absolute end-2 top-2">
            <Badge tone="sample">{t.sample}</Badge>
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {level && <span className="text-[11px] font-medium text-blush">{level}</span>}
        <Link href={href} className="mt-0.5">
          <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold text-ink">{primary}</h3>
        </Link>
        {secondary && (
          <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-faint">
            <bdi>{secondary}</bdi>
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.format.map((f) => (
            <Badge key={f} tone="format">
              {t.formats[f]}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            {compareAt && <p className="text-[11px] text-ink-faint line-through">{formatPrice(compareAt, locale, m)}</p>}
            <p className="text-[13px] font-semibold text-ink">
              {!single && <span className="font-normal text-ink-soft">{t.from} </span>}
              {formatPrice(price, locale, m)}
            </p>
          </div>
          {single ? (
            <AddToCartButton slug={product.slug} format={single} compact disabled={!isPurchasable(product)} />
          ) : (
            <Link
              href={href}
              aria-label={primary}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-deep text-ink transition hover:bg-line"
            >
              <ChevronIcon width={18} height={18} />
            </Link>
          )}
        </div>
      </div>
    </MotionSurface>
  );
}
