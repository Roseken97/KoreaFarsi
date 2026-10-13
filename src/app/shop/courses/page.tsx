import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/site/SitePage";
import { SiteIntro } from "@/components/site/SiteIntro";
import { ShopCard } from "@/components/shop/ShopCard";
import { getProducts } from "@/lib/bookstore/catalog";
import { levelBucket, type LevelBucket } from "@/lib/courses/types";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.courses.metaTitle, description: m.site.courses.metaDescription, alternates: localeAlternates("/shop/courses", locale) };
}

const LEVELS: LevelBucket[] = ["beginner", "intermediate", "advanced"];

/** Website page for the courses, filtered by level through ?level= (the signup level prompt links here too). */
export default async function CoursesPage(props: PageProps<"/shop/courses">) {
  const [{ m, locale }, products, params] = await Promise.all([getMessages(), getProducts(), props.searchParams]);
  const t = m.site.courses;
  const courses = products.filter((p) => p.category === "course");
  const level = LEVELS.find((l) => l === params.level) ?? null;
  const shown = level ? courses.filter((p) => levelBucket(p.level) === level) : courses;

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="강좌" accent="#B79CFF">
        {courses.length > 0 && (
          <nav aria-label={t.kicker} className="mt-4 flex flex-wrap gap-2">
            {([null, ...LEVELS] as const).map((l) => {
              const selected = l === level;
              return (
                <Link
                  key={l ?? "all"}
                  href={l ? `/shop/courses?level=${l}` : "/shop/courses"}
                  scroll={false}
                  aria-current={selected ? "page" : undefined}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    selected ? "bg-white/90 text-[#1C1336]" : "border border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]"
                  }`}
                >
                  {t.levels[l ?? "all"]}
                </Link>
              );
            })}
          </nav>
        )}
      </SiteIntro>
      <div className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-6">
        {shown.length === 0 ? (
          <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-[#C9BEE3]">{courses.length ? t.empty : t.emptyCatalog}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {shown.map((p) => (
              <li key={p.id}>
                <ShopCard product={p} m={m} locale={locale} />
              </li>
            ))}
          </ul>
        )}
        <Link href="/shop/books" className="mt-10 inline-flex rounded-full border border-white/20 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-white hover:bg-white/[0.1]">
          {t.other}
        </Link>
      </div>
    </SitePage>
  );
}
