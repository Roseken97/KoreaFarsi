"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { NAV_ITEMS, isActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const { m } = useI18n();

  return (
    <nav aria-label={m.nav.label} className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden">
      <ul className="mx-auto flex max-w-lg items-end justify-around rounded-[24px] border border-line/60 bg-surface/95 px-2 pt-7 pb-2.5 shadow-lift backdrop-blur-xl">
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
    </nav>
  );
}
