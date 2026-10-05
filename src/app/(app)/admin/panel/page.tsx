import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import { BooksStackIcon, BookmarkIcon, LanternIcon, LayersIcon, ShoppingBagIcon, SparkleIcon, TicketIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { appAdminAccess } from "../guard";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.adminHub.panel.title, robots: { index: false } };
}

const ITEMS: { key: "products" | "courses" | "announcements" | "koreaLife" | "tickets" | "orders" | "knowledge"; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "products", href: "/admin/products", Icon: ShoppingBagIcon },
  { key: "courses", href: "/admin/courses", Icon: BooksStackIcon },
  { key: "announcements", href: "/admin/announcements", Icon: SparkleIcon },
  { key: "koreaLife", href: "/admin/korea-life", Icon: LanternIcon },
  { key: "tickets", href: "/admin/tickets", Icon: TicketIcon },
  { key: "orders", href: "/admin/orders", Icon: BookmarkIcon },
  { key: "knowledge", href: "/admin/knowledge", Icon: LayersIcon },
];

/** Admin Panel group: links to the existing internal admin pages. */
export default async function AdminPanelPage() {
  const [{ m }, access] = await Promise.all([getMessages(), appAdminAccess("/admin/panel")]);
  const t = m.account.adminHub;

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.panel.title} backHref="/admin" backLabel={t.title} />
      {access === "ok" ? (
        <ListGroup>
          {ITEMS.map(({ key, href, Icon }) => (
            <ListRow key={key} href={href} Icon={Icon} title={t.panelItems[key]} />
          ))}
        </ListGroup>
      ) : (
        <Notice tone={access === "forbidden" ? "error" : undefined}>{t[access]}</Notice>
      )}
    </div>
  );
}
