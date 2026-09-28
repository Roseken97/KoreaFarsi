import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/PageHeader";
import { getMessages } from "@/lib/i18n/server";
import { DictionarySearch } from "./DictionarySearch";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.dictionaryPage.metaTitle };
}

/** Dictionary → search box that hands the word to Naver Dictionary (ko↔en) in a new tab; no scraping/embedding (against Naver's terms and fragile). */
export default async function DictionaryPage() {
  const { m } = await getMessages();
  const t = m.dictionaryPage;

  return (
    <div className="animate-fade-up">
      <PageHeader />
      <h1 className="font-display text-3xl font-semibold">{t.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t.subtitle}</p>
      <DictionarySearch />
    </div>
  );
}
