import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ShopCard } from "@/components/shop/ShopCard";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getProducts } from "@/lib/bookstore/catalog";
import { fmt } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getKoreaLifePosts } from "@/lib/korealife/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.site.search.metaTitle, robots: { index: false } };
}

/** Folds Arabic/Persian letter variants, zero-width joiners and case so "كتاب" finds "کتاب‌ها". */
function normalize(s: string) {
  return s
    .replace(/[‌‍‎‏]/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .toLowerCase()
    .trim();
}

function matches(query: string, ...fields: (string | null | undefined)[]) {
  const haystack = normalize(fields.filter(Boolean).join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Website search over the shop's products and the magazine's articles, in either language. */
export default async function SearchPage(props: PageProps<"/search">) {
  const [{ m, locale }, params] = await Promise.all([getMessages(), props.searchParams]);
  const t = m.site.search;
  const q = typeof params.q === "string" ? params.q.slice(0, 80) : "";
  const [products, posts] = q ? await Promise.all([getProducts(), getKoreaLifePosts()]) : [[], []];
  const foundProducts = products.filter((p) => matches(q, p.title, p.title_en, p.description, p.description_en, p.level));
  const foundPosts = posts.filter((p) => matches(q, p.title, p.title_en, p.excerpt, p.excerpt_en));
  const nothing = q && foundProducts.length === 0 && foundPosts.length === 0;

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} ko="검색" accent="#6FF3EE" />
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 pb-24 sm:px-6">
        <form action="/search" role="search" className="flex w-full max-w-[640px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 ps-5 focus-within:border-[#6FF3EE]/60">
          <SearchIcon width={20} height={20} className="shrink-0 text-[#A99FC4]" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            autoFocus={!q}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="min-w-0 flex-1 bg-transparent py-2 text-white outline-none placeholder:text-[#A99FC4]"
          />
          <button type="submit" className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-extrabold text-[#1C1336] hover:bg-white">
            {t.submit}
          </button>
        </form>

        {!q && <p className="m-0 text-sm text-[#A99FC4]">{t.hint}</p>}
        {nothing && <p className="m-0 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-[#C9BEE3]">{fmt(t.noResults, { q })}</p>}

        {foundProducts.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl font-black text-white">{t.products}</h2>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {foundProducts.map((p) => (
                <li key={p.id}>
                  <ShopCard product={p} m={m} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {foundPosts.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl font-black text-white">{t.articles}</h2>
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {foundPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/magazine/${p.slug}`} className="flex flex-col gap-1 rounded-[22px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25">
                    <span className="font-extrabold text-white" dir="auto">
                      {locale === "en" ? p.title_en || p.title : p.title}
                    </span>
                    <span className="line-clamp-2 text-sm text-[#C9BEE3]" dir="auto">
                      {locale === "en" ? p.excerpt_en || p.excerpt : p.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SitePage>
  );
}
