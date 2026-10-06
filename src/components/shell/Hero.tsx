import { AnnouncementCarousel } from "@/components/shell/AnnouncementCarousel";
import { getActiveAnnouncements } from "@/lib/announcements/queries";
import type { AnnouncementPlacement } from "@/lib/announcements/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Reusable hero/banner slot (sketch 06 callout #6, and Home). Shows every
 * active announcement for `placement` (/admin/announcements) back-to-back in
 * a swipeable carousel when there's at least one; otherwise falls back to
 * `children` (the page's own illustration/message).
 */
export async function Hero({
  placement,
  locale,
  size = "lg",
  children,
}: {
  placement: AnnouncementPlacement;
  locale: Locale;
  size?: "sm" | "lg";
  children?: React.ReactNode;
}) {
  const announcements = await getActiveAnnouncements(placement);
  const height = size === "lg" ? "h-48" : "h-28";

  if (announcements.length === 0) {
    return <section className={`relative overflow-hidden rounded-hero bg-gradient-to-br from-blush-soft via-cream to-sage-soft shadow-lift ${height}`}>{children}</section>;
  }

  return <AnnouncementCarousel items={announcements} locale={locale} height={height} />;
}
