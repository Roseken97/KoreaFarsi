import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/bookstore/Badges";
import { MotionCard } from "@/components/motion/MotionCard";
import { BookstoreHeader } from "@/components/bookstore/BookstoreHeader";
import { ProductCover } from "@/components/bookstore/ProductCover";
import { ProductPurchase } from "@/components/bookstore/ProductPurchase";
import { ChevronIcon } from "@/components/icons";
import { getProductBySlug, getProducts } from "@/lib/bookstore/catalog";
import { levelLabel } from "@/lib/bookstore/format";
import { descriptionOf, titles } from "@/lib/bookstore/types";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(props: PageProps<"/bookstore/[slug]">): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([props.params, getMessages()]);
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: titles(product, locale).primary, description: descriptionOf(product, locale).slice(0, 160) };
}

export default async function ProductPage(props: PageProps<"/bookstore/[slug]">) {
  const [{ slug }, { m, locale }] = await Promise.all([props.params, getMessages()]);
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const t = m.bookstore;
  const { primary, secondary } = titles(product, locale);
  const level = levelLabel(product.level, m);
  const included = product.bundle_items
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="animate-fade-up">
      <BookstoreHeader backHref="/bookstore" />

      <div className="grid gap-8">
        <div className="mx-auto w-full max-w-[15rem]">
          <ProductCover product={product} sizes="(min-width: 768px) 360px, 240px" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {level && <span className="text-xs font-medium text-blush">{level}</span>}
              {product.is_coming_soon && <Badge tone="soon">{t.comingSoon}</Badge>}
              {product.is_sample && <Badge tone="sample">{t.sample}</Badge>}
            </div>
            <h1 className="mt-2 font-display text-3xl leading-tight font-semibold">{primary}</h1>
            {secondary && (
              <p className="mt-1 text-sm text-ink-faint">
                <bdi>{secondary}</bdi>
              </p>
            )}
          </div>

          <p className="text-[15px] leading-7 text-ink-soft">{descriptionOf(product, locale)}</p>

          <ProductPurchase product={product} />

          {included.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-ink">{t.product.includes}</h2>
              <ul className="divide-y divide-line/70 overflow-hidden rounded-card bg-surface shadow-soft">
                {included.map((p) => (
                  <li key={p.id}>
                    <MotionCard href={`/bookstore/${p.slug}`} tilt={false} className="flex items-center gap-3 p-3 hover:bg-cream/70">
                      <span className="w-10 shrink-0">
                        <ProductCover product={p} sizes="40px" mini />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{titles(p, locale).primary}</span>
                      <ChevronIcon width={16} height={16} className="text-ink-faint" />
                    </MotionCard>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.is_sample && <p className="text-xs text-ink-faint">{t.product.sampleNote}</p>}
        </div>
      </div>
    </div>
  );
}
