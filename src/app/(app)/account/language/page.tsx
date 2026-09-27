import type { Metadata } from "next";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getMessages } from "@/lib/i18n/server";
import { LanguageOptions } from "./LanguageOptions";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.languagePage.title };
}

export default async function LanguagePage() {
  const { m } = await getMessages();
  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={m.account.languagePage.title} backHref="/account" backLabel={m.account.title} />
      <p className="mb-4 text-sm leading-6 text-ink-soft">{m.account.languagePage.body}</p>
      <LanguageOptions />
    </div>
  );
}
