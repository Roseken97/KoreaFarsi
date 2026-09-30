import type { Metadata } from "next";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getMyNotifications } from "@/lib/notifications/queries";
import { getMessages } from "@/lib/i18n/server";
import { NotificationsList } from "./NotificationsList";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.notifications.metaTitle };
}

/** Real per-user notifications (e.g. library access granted) — see supabase/migrations/0017_notifications.sql. */
export default async function NotificationsPage() {
  const [{ m, locale }, notifications] = await Promise.all([getMessages(), getMyNotifications()]);

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={m.notifications.title} backHref="/home" backLabel={m.common.backHome} />
      <NotificationsList notifications={notifications} locale={locale} />
    </div>
  );
}
