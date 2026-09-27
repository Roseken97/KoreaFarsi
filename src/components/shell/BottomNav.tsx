"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { NAV_ITEMS, isActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const { m } = useI18n();

  return (
    <nav
      aria-label={m.nav.label}
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-surface/90 backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-around px-2 pt-2">
        {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
          const label = m.nav[labelKey];
          const active = isActive(pathname, href);
          const isHome = href === "/home";

          if (isHome) {
            return (
              <li key={href} className="-mt-6 flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="mx-auto flex w-fit flex-col items-center gap-1"
                >
                  <span
                    className={`grid size-14 place-items-center rounded-full shadow-lift ring-4 ring-cream transition ${
                      active ? "bg-ink text-cream" : "bg-ink/90 text-cream/85"
                    }`}
                  >
                    <Icon width={26} height={26} />
                  </span>
                  <span className={`text-[11px] font-medium ${active ? "text-teal" : "text-ink-faint"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-xl py-1.5 transition ${
                  active ? "text-teal" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                <Icon width={23} height={23} />
                <span className="text-[11px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
