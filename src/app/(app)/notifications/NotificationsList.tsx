"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/notifications/actions";
import type { AppNotification } from "@/lib/notifications/types";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

export function NotificationsList({ notifications, locale }: { notifications: AppNotification[]; locale: Locale }) {
  const { m } = useI18n();
  const t = m.notifications;
  const [items, setItems] = useState(notifications);
  const hasUnread = items.some((n) => !n.is_read);

  async function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markAllNotificationsRead();
  }

  if (items.length === 0) {
    return <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-ink-soft">{t.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {hasUnread && (
        <button onClick={markAll} className="self-end text-sm font-semibold text-teal-deep">
          {t.markAllRead}
        </button>
      )}
      <ul className="flex flex-col gap-2">
        {items.map((n) => (
          <NotificationRow key={n.id} notification={n} locale={locale} onRead={(id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, is_read: true } : x)))} />
        ))}
      </ul>
    </div>
  );
}

function NotificationRow({ notification, locale, onRead }: { notification: AppNotification; locale: Locale; onRead: (id: string) => void }) {
  const title = locale === "en" ? notification.title_en || notification.title : notification.title;
  const body = locale === "en" ? notification.body_en || notification.body : notification.body;
  const date = new Date(notification.created_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" });

  function onClick(e: MouseEvent) {
    if (!notification.href) e.preventDefault();
    if (!notification.is_read) {
      onRead(notification.id);
      markNotificationRead(notification.id);
    }
  }

  const content = (
    <div className={`flex items-start gap-3 rounded-[16px] border p-3.5 ${notification.is_read ? "border-line bg-surface" : "border-teal/30 bg-sage-soft"}`}>
      {!notification.is_read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" aria-hidden="true" />}
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${notification.is_read ? "font-medium text-ink-soft" : "font-semibold text-ink"}`} dir="auto">
          {title}
        </p>
        {body && (
          <p className="mt-0.5 text-[13px] leading-5 text-ink-faint" dir="auto">
            {body}
          </p>
        )}
      </div>
      <span className="shrink-0 text-[11px] text-ink-faint" dir="ltr">
        {date}
      </span>
    </div>
  );

  return <li>{notification.href ? <Link href={notification.href} onClick={onClick}>{content}</Link> : <button onClick={onClick} className="block w-full text-start">{content}</button>}</li>;
}
