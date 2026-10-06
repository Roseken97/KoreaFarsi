import type { Metadata } from "next";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { Hero } from "@/components/shell/Hero";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getKoreaLifePosts } from "@/lib/korealife/queries";
import { getMessages } from "@/lib/i18n/server";
import { KoreaLifeBrowser } from "./KoreaLifeBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.koreaLife.metaTitle };
}

/** Culture/travel/food articles, following the same list pattern as Courses. */
export default async function KoreaLifePage() {
  const [{ m, locale }, posts] = await Promise.all([getMessages(), getKoreaLifePosts()]);
  const t = m.koreaLife;

  return (
    <div className="animate-fade-up">
      <SubPageHeader title={t.title} backHref="/home" backLabel={m.common.backHome} />
      <p className="mb-5 text-sm text-ink-soft">{t.subtitle}</p>

      <div className="mb-6">
        <Hero placement="all" locale={locale} size="sm">
          <SakuraBranch className="absolute -top-3 -end-3 w-32 rtl:-scale-x-100" />
          <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-16" />
        </Hero>
      </div>

      <KoreaLifeBrowser posts={posts} />
    </div>
  );
}
