import Link from "next/link";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import { SeoulSkyline } from "@/components/brand/SeoulSkyline";
import { ChevronIcon } from "@/components/icons";
import { getActiveAnnouncement } from "@/lib/announcements/queries";
import type { AnnouncementPlacement } from "@/lib/announcements/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Reusable hero/banner slot (sketch 06 callout #6, and Home). Shows the active
 * announcement for `placement` (/admin/announcements) when there is one;
 * otherwise falls back to `children` (the page's own illustration/message).
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
  const announcement = await getActiveAnnouncement(placement);
  const height = size === "lg" ? "h-48 md:h-60" : "h-28 md:h-32";

  if (!announcement) {
    return <section className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blush-soft via-cream to-sage-soft shadow-lift ${height}`}>{children}</section>;
  }

  const title = locale === "en" ? announcement.title_en || announcement.title : announcement.title;
  const body = locale === "en" ? announcement.body_en || announcement.body : announcement.body;
  const content = (
    <>
      <span className="absolute -top-10 -start-10 size-32 rounded-full bg-white/30 blur-2xl" aria-hidden="true" />
      <span className="absolute end-6 top-10 size-16 rounded-full bg-blush/20 blur-xl" aria-hidden="true" />
      <SakuraBranch className="absolute -top-2 -end-2 w-40 opacity-70 md:w-56 rtl:-scale-x-100" />
      <SeoulSkyline className="absolute! inset-x-0 bottom-0 h-24 opacity-70 md:h-32" />
      <div className="relative flex h-full flex-col justify-center p-6 md:p-8">
        <p className="max-w-[16rem] font-display text-xl leading-snug font-semibold text-ink md:max-w-sm md:text-2xl" dir="auto">
          {title}
        </p>
        {body && (
          <p className="mt-1.5 max-w-[18rem] text-sm leading-6 text-ink-soft md:max-w-sm" dir="auto">
            {body}
          </p>
        )}
        {announcement.href && (
          <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-surface/90 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur">
            {locale === "fa" ? "بیشتر بدانید" : "Learn more"}
            <ChevronIcon width={13} height={13} className="rtl:-scale-x-100" />
          </span>
        )}
      </div>
    </>
  );

  const className = `relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blush-soft via-cream to-sage-soft shadow-lift ${height}`;
  return announcement.href ? (
    <Link href={announcement.href} className={`block ${className}`}>
      {content}
    </Link>
  ) : (
    <section className={className}>{content}</section>
  );
}
