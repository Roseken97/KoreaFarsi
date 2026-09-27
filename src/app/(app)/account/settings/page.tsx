import type { Metadata } from "next";
import { BellIcon, GlobeIcon, PaletteIcon, ShieldIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ListGroup, ListRow, RowContent } from "@/components/ui/ListRow";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.settingsPage.title };
}

/** App Settings. Only Language is functional in Phase 1; the rest state their status honestly. */
export default async function SettingsPage() {
  const { m } = await getMessages();
  const t = m.account.settingsPage;
  const rows = [
    { Icon: BellIcon, ...t.notifications },
    { Icon: PaletteIcon, ...t.appearance },
    { Icon: ShieldIcon, ...t.privacy },
  ];

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.title} backHref="/account" backLabel={m.account.title} />
      <div className="flex flex-col gap-4">
        <ListGroup>
          <ListRow
            href="/account/language"
            Icon={GlobeIcon}
            title={m.account.items.language.title}
            body={m.account.items.language.body}
          />
        </ListGroup>
        <ListGroup>
          {rows.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3 px-4 py-3.5">
              <RowContent Icon={Icon} title={title} body={body} badge={m.account.soonBadge} wrap />
            </li>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
