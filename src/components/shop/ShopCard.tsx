import Link from "next/link";
import { ProductCover } from "@/components/bookstore/ProductCover";
import { formatPrice, levelLabel } from "@/lib/bookstore/format";
import { discountPercent, lowestPrice, titles, type Product } from "@/lib/bookstore/types";
import { fmt, formatNumber, type Locale, type Messages } from "@/lib/i18n/config";

/** Product card for the website shop: cover, title, level and lowest price on the site's glass card. */
export function ShopCard({ product, m, locale }: { product: Product; m: Messages; locale: Locale }) {
  const t = m.bookstore;
  const { primary, secondary } = titles(product, locale);
  const level = levelLabel(product.level, m);
  const off = product.format.length ? Math.max(...product.format.map((f) => discountPercent(product, f))) : 0;
  const multi = product.format.length > 1;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
    >
      <div className="relative">
        <ProductCover product={product} sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw" />
        <div className="absolute start-2 top-2 flex flex-wrap gap-1">
          {product.is_coming_soon && <span className="rounded-full bg-[#B79CFF] px-2 py-0.5 text-[11px] font-extrabold text-[#1C1336]">{t.comingSoon}</span>}
          {off > 0 && <span className="rounded-full bg-[#FF8FC7] px-2 py-0.5 text-[11px] font-extrabold text-[#1C1336]">{fmt(t.off, { n: formatNumber(off, locale) })}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {level && <span className="text-xs font-bold text-[#FF8FC7]">{level}</span>}
        <h3 className="m-0 line-clamp-2 text-[16px] leading-snug font-extrabold text-white">{primary}</h3>
        {secondary && (
          <p className="m-0 line-clamp-1 text-xs text-[#A99FC4]">
            <bdi>{secondary}</bdi>
          </p>
        )}
        <p className="mt-auto pt-2 text-[15px] font-extrabold text-[#6FF3EE]">
          {multi && <span className="text-xs font-bold text-[#A99FC4]">{t.from} </span>}
          {formatPrice(lowestPrice(product), locale, m)}
        </p>
      </div>
    </Link>
  );
}
