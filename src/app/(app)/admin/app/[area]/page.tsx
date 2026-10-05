import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyEditor } from "@/components/admin/CopyEditor";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { listCopyOverridesAdmin } from "@/lib/site-copy/admin-actions";
import { entriesForArea, getCopyArea } from "@/lib/site-copy/areas";
import { appAdminAccess } from "../../guard";

export async function generateMetadata(props: PageProps<"/admin/app/[area]">): Promise<Metadata> {
  const [{ area: id }, { locale }] = await Promise.all([props.params, getMessages()]);
  const area = getCopyArea(id);
  return { title: area?.label[locale], robots: { index: false } };
}

/** Text editor for one part of the app (admins only). */
export default async function AppAdminAreaPage(props: PageProps<"/admin/app/[area]">) {
  const [{ area: id }, { m, locale }] = await Promise.all([props.params, getMessages()]);
  const area = getCopyArea(id);
  if (!area) notFound();

  const t = m.account.adminHub;
  const access = await appAdminAccess(`/admin/app/${id}`);
  const header = <SubPageHeader title={area.label[locale]} backHref="/admin/app" backLabel={t.appAdmin.title} />;

  if (access !== "ok") {
    return (
      <div className="animate-fade-up max-w-lg">
        {header}
        <Notice tone={access === "forbidden" ? "error" : undefined}>{t[access]}</Notice>
      </div>
    );
  }

  const overrides = await listCopyOverridesAdmin();

  return (
    <div className="animate-fade-up max-w-4xl">
      {header}
      <CopyEditor entries={entriesForArea(id)} initialOverrides={overrides} />
    </div>
  );
}
