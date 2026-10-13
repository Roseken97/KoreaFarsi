import type { Metadata } from "next";
import { Suspense } from "react";
import { SitePage } from "@/components/site/SitePage";
import { ShopCard } from "@/components/shop/ShopCard";
import { ShopCategories, type ShopCategory } from "@/components/shop/ShopCategories";
import { getProducts } from "@/lib/bookstore/catalog";
import type { Category } from "@/lib/bookstore/types";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.shop.metaTitle, description: m.shop.metaDescription, alternates: localeAlternates("/shop", locale) };
}

const ORDER: Category[] = ["course", "book", "bundle", "planner", "merch"];

/** Website shop: the same catalog as the app's bookstore, in the website's look. Category comes from ?cat=. */
export default async function ShopPage(props: PageProps<"/shop">) {
  const [{ m, locale }, products, params] = await Promise.all([getMessages(), getProducts(), props.searchParams]);
  const t = m.shop;
  const present = ORDER.filter((c) => products.some((p) => p.category === c));
  const categories: ShopCategory[] = ["all", ...present];
  const cat = typeof params.cat === "string" && present.includes(params.cat as Category) ? (params.cat as Category) : null;
  const shown = cat ? products.filter((p) => p.category === cat) : products;

  return (
    <SitePage>
      <div className="mx-auto max-w-[1200px] px-5 pt-14 pb-24 sm:px-6">
        <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.kicker}</span>
        <h1 className="m-0 mt-2 text-[clamp(30px,5vw,48px)] leading-tight font-black text-white">{t.title}</h1>
        <p className="mt-3 max-w-[640px] text-[#C9BEE3]">{t.subtitle}</p>

        {products.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-[#C9BEE3]">{t.emptyCatalog}</p>
        ) : (
          <>
            <div className="mt-8">
              <Suspense>
                <ShopCategories categories={categories} />
              </Suspense>
            </div>
            {shown.length === 0 ? (
              <p className="mt-10 text-[#C9BEE3]">{t.empty}</p>
            ) : (
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {shown.map((p) => (
                  <li key={p.id}>
                    <ShopCard product={p} m={m} locale={locale} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </SitePage>
  );
}
