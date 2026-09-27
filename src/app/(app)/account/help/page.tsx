import type { Metadata } from "next";
import { ContactLinks, configuredChannels } from "@/components/ContactLinks";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.helpPage.title };
}

export default async function HelpPage() {
  const { m } = await getMessages();
  const t = m.account.helpPage;

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.title} backHref="/account" backLabel={m.account.title} />
      <p className="mb-4 text-sm leading-6 text-ink-soft">{t.body}</p>
      {configuredChannels().length === 0 ? <Notice>{t.noChannels}</Notice> : <ContactLinks m={m} />}
    </div>
  );
}
