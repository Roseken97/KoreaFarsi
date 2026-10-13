import type { Metadata } from "next";
import { SiteDictionary } from "@/components/site/SiteDictionary";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.dictionary.title, description: m.site.dictionary.subtitle, alternates: localeAlternates("/tools/dictionary", locale) };
}

/** Website dictionary page: one big search box that opens Naver's dictionary. */
export default async function SiteDictionaryPage() {
  const { m } = await getMessages();
  const t = m.site.dictionary;
  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="사전" accent="#2FE6E0">
        <SiteDictionary />
      </SiteIntro>
      <div className="pb-24" />
    </SitePage>
  );
}
