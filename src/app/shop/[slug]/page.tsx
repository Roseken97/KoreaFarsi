import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCover } from "@/components/bookstore/ProductCover";
import { ChevronIcon } from "@/components/icons";
import { ShopPurchase } from "@/components/shop/ShopPurchase";
import { SitePage } from "@/components/site/SitePage";
import { getProductBySlug, getProducts } from "@/lib/bookstore/catalog";
import { levelLabel } from "@/lib/bookstore/format";
import { descriptionOf, isPurchasable, lowestPrice, titles } from "@/lib/bookstore/types";
import { getCourses } from "@/lib/courses/queries";
import { getMessages } from "@/lib/i18n/server";
import { langUrl, NOINDEX, pageMetadata, SITE_URL, snippet } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([props.params, getMessages()]);
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = titles(product, locale).primary;
  return pageMetadata({ locale, path: `/shop/${slug}`, title, description: snippet(descriptionOf(product, locale)), image: product.cover_image_url, imageAlt: title, robots: product.is_sample ? NOINDEX : undefined });
}

/** Website product page: same product row as the app's bookstore, shown in the site's look. */
export default async function ShopProductPage(props: PageProps<"/shop/[slug]">) {
  const [{ slug }, { m, locale }, products] = await Promise.all([props.params, getMessages(), getProducts()]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const t = m.shop;
  const { primary, secondary } = titles(product, locale);
  const level = levelLabel(product.level, m);
  const course = product.category === "course" ? (await getCourses()).find((c) => c.product_id === product.id) : undefined;
  const included = product.bundle_items
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Product + breadcrumb structured data so Google can show price and the shop path in results.
  const url = `${SITE_URL}${langUrl(`/shop/${slug}`, locale)}`;
  const lowPrice = lowestPrice(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: primary,
        ...(secondary ? { alternateName: secondary } : {}),
        description: descriptionOf(product, locale) || undefined,
        ...(product.cover_image_url ? { image: product.cover_image_url } : {}),
        brand: { "@type": "Brand", name: "KoreaFarsi" },
        url,
        ...(lowPrice > 0
          ? {
              offers: {
                "@type": "Offer",
                url,
                // Prices are stored in Toman; schema.org wants ISO 4217, and 1 Toman = 10 Rial.
                price: lowPrice * 10,
                priceCurrency: "IRR",
                availability: isPurchasable(product) ? "https://schema.org/InStock" : product.is_coming_soon ? "https://schema.org/PreOrder" : "https://schema.org/OutOfStock",
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: m.homepage.menu.home, item: `${SITE_URL}${langUrl("/", locale)}` },
          { "@type": "ListItem", position: 2, name: m.homepage.menu.shop, item: `${SITE_URL}${langUrl("/shop", locale)}` },
          { "@type": "ListItem", position: 3, name: primary, item: url },
        ],
      },
    ],
  };

  return (
    <SitePage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[1040px] px-5 pt-10 pb-24 sm:px-6">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C9BEE3] hover:text-white">
          <ChevronIcon width={16} height={16} className="rotate-180" />
          {t.backToShop}
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
          <div className="mx-auto w-full max-w-[280px] md:max-w-none">
            <ProductCover product={product} sizes="(min-width: 768px) 340px, 280px" />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {level && <span className="text-sm font-bold text-[#FF8FC7]">{level}</span>}
                {product.is_coming_soon && (
                  <span className="rounded-full bg-[#B79CFF] px-2.5 py-0.5 text-xs font-extrabold text-[#1C1336]">{m.bookstore.comingSoon}</span>
                )}
              </div>
              <h1 className="m-0 mt-2 text-[clamp(28px,4.5vw,42px)] leading-tight font-black text-white">{primary}</h1>
              {secondary && (
                <p className="m-0 mt-1 text-sm text-[#A99FC4]">
                  <bdi>{secondary}</bdi>
                </p>
              )}
            </div>

            {descriptionOf(product, locale) && <p className="m-0 whitespace-pre-line text-[16px] text-[#DCD3F0]">{descriptionOf(product, locale)}</p>}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
              <ShopPurchase product={product} />
              {isPurchasable(product) && <p className="m-0 mt-4 text-[13px] leading-6 text-[#A99FC4]">{t.accountNote}</p>}
            </div>

            {course && (
              <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-[#6FF3EE] hover:text-white">
                {t.viewCourse}
                <ChevronIcon width={16} height={16} />
              </Link>
            )}

            {included.length > 0 && (
              <section>
                <h2 className="m-0 mb-3 text-[15px] font-extrabold text-white">{m.bookstore.product.includes}</h2>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {included.map((p) => (
                    <li key={p.id}>
                      <Link href={`/shop/${p.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.07]">
                        <span className="w-10 shrink-0">
                          <ProductCover product={p} sizes="40px" mini />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{titles(p, locale).primary}</span>
                        <ChevronIcon width={16} height={16} className="text-[#A99FC4]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.is_sample && <p className="m-0 text-xs text-[#A99FC4]">{m.bookstore.product.sampleNote}</p>}
          </div>
        </div>
      </div>
    </SitePage>
  );
}
