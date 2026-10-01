"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { dirOf } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { NAV_ITEMS, isActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const { m, locale } = useI18n();

  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(pathname, item.href));
  const n = NAV_ITEMS.length;
  const centerPct = activeIndex >= 0 ? ((activeIndex + 0.5) / n) * 100 : -100;
  // The notch is a physical (not logical) cutout, so mirror its x position in RTL.
  const notchX = dirOf(locale) === "rtl" ? 100 - centerPct : centerPct;

  return (
    <nav aria-label={m.nav.label} className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden">
      <div className="relative mx-auto max-w-lg">
        {/* Bar surface only — the notch mask cuts into this layer, not the icons on top of it. */}
        <div
          style={{ "--notch-x": `${notchX}%` } as CSSProperties}
          className="navbar-notch absolute inset-0 rounded-[24px] border border-line/60 bg-surface/95 shadow-lift backdrop-blur-xl"
          aria-hidden="true"
        />
        <ul className="relative flex items-end justify-around px-2 pt-7 pb-2.5">
          {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
            const label = m.nav[labelKey];
            const active = isActive(pathname, href);

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={
                      active
                        ? "-mt-9 grid size-13 place-items-center rounded-full border-2 border-violet bg-violet text-white shadow-[0_8px_20px_-6px_rgb(123_67_214_/_0.6)]"
                        : "grid size-5 place-items-center text-ink-faint"
                    }
                  >
                    <Icon width={active ? 24 : 20} height={active ? 24 : 20} />
                  </span>
                  <span className={`text-[11px] ${active ? "font-semibold text-violet-deep" : "font-medium text-ink-faint"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
