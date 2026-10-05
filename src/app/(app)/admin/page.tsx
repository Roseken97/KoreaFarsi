import type { Metadata } from "next";
import { PencilIcon, ShieldIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { appAdminAccess } from "./guard";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.adminHub.title, robots: { index: false } };
}

/** Admin home: two groups first (App Admin, Admin Panel), each opening its own sections. */
export default async function AdminHubPage() {
  const [{ m }, access] = await Promise.all([getMessages(), appAdminAccess("/admin")]);
  const t = m.account.adminHub;

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.title} backHref="/account" backLabel={m.account.title} />
      {access === "ok" ? (
        <ListGroup>
          <ListRow href="/admin/app" Icon={PencilIcon} title={t.appAdmin.title} body={t.appAdmin.body} tone="bg-violet text-white" />
          <ListRow href="/admin/panel" Icon={ShieldIcon} title={t.panel.title} body={t.panel.body} tone="bg-violet text-white" />
        </ListGroup>
      ) : (
        <Notice tone={access === "forbidden" ? "error" : undefined}>{t[access]}</Notice>
      )}
    </div>
  );
}
