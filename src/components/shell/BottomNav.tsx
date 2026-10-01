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
      <ul className="mx-auto flex max-w-lg items-center justify-around gap-1 rounded-[28px] border border-line/60 bg-surface/90 px-2 py-2.5 shadow-lift backdrop-blur-xl">
        {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
          const label = m.nav[labelKey];
          const active = isActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`grid size-11 place-items-center rounded-full border-2 transition ${
                    active
                      ? "border-violet bg-violet text-white shadow-[0_6px_16px_-4px_rgb(123_67_214_/_0.55)]"
                      : "border-violet/25 bg-transparent text-violet hover:border-violet/40"
                  }`}
                >
                  <Icon width={20} height={20} />
                </span>
                <span className={`text-[11px] font-medium ${active ? "text-violet-deep" : "text-ink-faint"}`}>
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
