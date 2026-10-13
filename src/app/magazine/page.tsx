import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LanternIcon } from "@/components/icons";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getKoreaLifePosts } from "@/lib/korealife/queries";
import type { KoreaLifeCategory } from "@/lib/korealife/types";
import { getMessages } from "@/lib/i18n/server";
import { NOINDEX, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ m, locale }, posts] = await Promise.all([getMessages(), getKoreaLifePosts()]);
  // An empty listing is a thin page: keep it out of the index until it has items.
  return pageMetadata({ locale, path: "/magazine", title: m.site.koreaLife.metaTitle, description: m.site.koreaLife.subtitle, robots: posts.length > 0 ? undefined : NOINDEX });
}

const CATEGORIES: KoreaLifeCategory[] = ["culture", "travel", "food", "life"];
const COLOR: Record<KoreaLifeCategory, string> = { culture: "#B79CFF", travel: "#5D8FE8", food: "#FFC59A", life: "#FFB72B" };

/** Website magazine: the same Korea Life articles as the app, as a site page with category chips (?cat=). */
export default async function MagazinePage(props: PageProps<"/magazine">) {
  const [{ m, locale }, posts, params] = await Promise.all([getMessages(), getKoreaLifePosts(), props.searchParams]);
  const t = m.site.koreaLife;
  const cat = CATEGORIES.find((c) => c === params.cat) ?? null;
  const shown = cat ? posts.filter((p) => p.category === cat) : posts;

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="한국 생활" accent="#FFB72B">
        <nav aria-label={t.title} className="mt-4 flex flex-wrap gap-2">
          {([null, ...CATEGORIES] as const).map((c) => {
            const selected = c === cat;
            return (
              <Link
                key={c ?? "all"}
                href={c ? `/magazine?cat=${c}` : "/magazine"}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  selected ? "bg-white/90 text-[#1C1336]" : "border border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]"
                }`}
              >
                {c ? m.koreaLife.categories[c] : t.all}
              </Link>
            );
          })}
        </nav>
      </SiteIntro>

      <div className="mx-auto max-w-[1200px] px-5 pb-24 sm:px-6">
        {shown.length === 0 ? (
          <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-[#C9BEE3]">{m.koreaLife.empty}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const title = locale === "en" ? p.title_en || p.title : p.title;
              const excerpt = locale === "en" ? p.excerpt_en || p.excerpt : p.excerpt;
              const color = COLOR[p.category];
              return (
                <li key={p.id}>
                  <Link
                    href={`/magazine/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: `${color}22` }}>
                      {p.cover_image_url ? (
                        <Image src={p.cover_image_url} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <span className="grid size-full place-items-center" style={{ color }}>
                          <LanternIcon width={44} height={44} />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-5">
                      <span className="text-xs font-extrabold tracking-wide" style={{ color }}>
                        {m.koreaLife.categories[p.category]}
                      </span>
                      <h2 className="m-0 text-lg leading-snug font-black text-white" dir="auto">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="m-0 line-clamp-3 text-sm text-[#C9BEE3]" dir="auto">
                          {excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SitePage>
  );
}
