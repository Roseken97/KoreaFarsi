import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import {
  AccountIcon,
  BellIcon,
  BooksStackIcon,
  DictionaryIcon,
  HelpIcon,
  HomeIcon,
  LanternIcon,
  LibraryIcon,
  PlannerIcon,
  RobotIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { fmt, formatNumber } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { listCopyOverridesAdmin } from "@/lib/site-copy/admin-actions";
import { COPY_AREAS, entriesForArea } from "@/lib/site-copy/areas";
import { appAdminAccess } from "../guard";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.adminHub.appAdmin.title, robots: { index: false } };
}

const AREA_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  landing: StarIcon,
  auth: AccountIcon,
  home: HomeIcon,
  courses: BooksStackIcon,
  library: LibraryIcon,
  bookstore: ShoppingBagIcon,
  planner: PlannerIcon,
  ai: RobotIcon,
  "korea-life": LanternIcon,
  dictionary: DictionaryIcon,
  notifications: BellIcon,
  account: SparkleIcon,
  general: HelpIcon,
  admin: ShieldIcon,
};

/** App Admin (admins only): one row per part of the app, each opening its own text editor. */
export default async function AppAdminPage() {
  const [{ m, locale }, access] = await Promise.all([getMessages(), appAdminAccess("/admin/app")]);
  const t = m.account.adminHub;
  const header = <SubPageHeader title={t.appAdmin.title} backHref="/admin" backLabel={t.title} />;

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
    <div className="animate-fade-up max-w-lg">
      {header}
      <p className="mb-4 text-sm text-ink-soft">{t.intro}</p>
      <ListGroup>
        {COPY_AREAS.map((area) => {
          const entries = entriesForArea(area.id);
          const edited = entries.filter((e) => e.key in overrides.en || e.key in overrides.fa).length;
          const body = fmt(t.count, { n: formatNumber(entries.length, locale) }) + (edited ? ` · ${fmt(t.edited, { n: formatNumber(edited, locale) })}` : "");
          return <ListRow key={area.id} href={`/admin/app/${area.id}`} Icon={AREA_ICONS[area.id] ?? SparkleIcon} title={area.label[locale]} body={body} />;
        })}
      </ListGroup>
    </div>
  );
}
