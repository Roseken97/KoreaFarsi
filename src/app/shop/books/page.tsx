import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/site/SitePage";
import { SiteIntro } from "@/components/site/SiteIntro";
import { ShopCard } from "@/components/shop/ShopCard";
import { getProducts } from "@/lib/bookstore/catalog";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.books.metaTitle, description: m.site.books.metaDescription, alternates: localeAlternates("/shop/books", locale) };
}

/** Website page for the books: the shop's book (and bundle) products on their own page. */
export default async function BooksPage() {
  const [{ m, locale }, products] = await Promise.all([getMessages(), getProducts()]);
  const t = m.site.books;
  const books = products.filter((p) => p.category === "book" || p.category === "bundle");

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="책" accent="#FF8FC7" />
      <div className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-6">
        {books.length === 0 ? (
          <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-[#C9BEE3]">{t.empty}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {books.map((p) => (
              <li key={p.id}>
                <ShopCard product={p} m={m} locale={locale} />
              </li>
            ))}
          </ul>
        )}
        <Link href="/shop/courses" className="mt-10 inline-flex rounded-full border border-white/20 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-white hover:bg-white/[0.1]">
          {t.other}
        </Link>
      </div>
    </SitePage>
  );
}
