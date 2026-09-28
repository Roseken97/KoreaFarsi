"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import type { Announcement } from "@/lib/announcements/types";
import type { Locale } from "@/lib/i18n/config";

/** Multiple active announcements shown back-to-back: swipe/scroll-snap carousel with dot indicators. */
export function AnnouncementCarousel({ items, locale, height }: { items: Announcement[]; locale: Locale; height: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className={`relative overflow-hidden rounded-[28px] shadow-lift ${height}`}>
      <div ref={trackRef} onScroll={onScroll} className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {items.map((a) => (
          <Card key={a.id} announcement={a} locale={locale} />
        ))}
      </div>

      {items.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`${i + 1}`} className={`size-1.5 rounded-full transition ${i === index ? "w-4 bg-ink" : "bg-ink/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ announcement, locale }: { announcement: Announcement; locale: Locale }) {
  const title = locale === "en" ? announcement.title_en || announcement.title : announcement.title;
  const body = locale === "en" ? announcement.body_en || announcement.body : announcement.body;

  const inner = (
    <div className="relative h-full w-full shrink-0 snap-start overflow-hidden bg-gradient-to-br from-blush-soft via-cream to-sage-soft">
      {announcement.image_url && <Image src={announcement.image_url} alt="" fill sizes="100vw" className="object-cover" />}
      {announcement.image_url && <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" aria-hidden="true" />}
      <div className="relative flex h-full flex-col justify-center p-6 md:p-8">
        <p className={`max-w-[16rem] font-display text-xl leading-snug font-semibold md:max-w-sm md:text-2xl ${announcement.image_url ? "text-white" : "text-ink"}`} dir="auto">
          {title}
        </p>
        {body && (
          <p className={`mt-1.5 max-w-[18rem] text-sm leading-6 md:max-w-sm ${announcement.image_url ? "text-white/85" : "text-ink-soft"}`} dir="auto">
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
    </div>
  );

  return (
    <div className="h-full w-full shrink-0 snap-start">{announcement.href ? <Link href={announcement.href} className="block h-full">{inner}</Link> : inner}</div>
  );
}
