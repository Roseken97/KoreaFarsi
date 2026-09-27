import type { Metadata } from "next";
import { InstagramIcon, MailIcon, SendIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ListGroup, RowContent } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.helpPage.title };
}

const ICONS = { instagram: InstagramIcon, telegram: SendIcon, email: MailIcon };

export default async function HelpPage() {
  const { m } = await getMessages();
  const t = m.account.helpPage;
  const channels = (Object.keys(CONTACT) as (keyof typeof CONTACT)[]).filter((k) => CONTACT[k]);

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.title} backHref="/account" backLabel={m.account.title} />
      <p className="mb-4 text-sm leading-6 text-ink-soft">{t.body}</p>
      {channels.length === 0 ? (
        <Notice>{t.noChannels}</Notice>
      ) : (
        <ListGroup>
          {channels.map((k) => (
            <li key={k}>
              <a
                href={CONTACT_LINKS[k](CONTACT[k])}
                target={k === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-cream/70"
              >
                <RowContent Icon={ICONS[k]} title={t.channels[k]} body={k === "email" ? CONTACT[k] : `@${CONTACT[k]}`} />
              </a>
            </li>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
