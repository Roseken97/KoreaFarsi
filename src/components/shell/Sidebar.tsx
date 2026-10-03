"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n/client";
import { LanguageSwitch } from "./LanguageSwitch";
import { NAV_ITEMS, isActive } from "./nav-items";

// Desktop keeps Home first: the "center slot" is a thumb-reach pattern that
// only makes sense on the mobile bottom bar.
const SIDEBAR_ITEMS = [
  ...NAV_ITEMS.filter((i) => i.href === "/home"),
  ...NAV_ITEMS.filter((i) => i.href !== "/home"),
];

export function Sidebar() {
  const pathname = usePathname();
  const { m } = useI18n();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-line/70 bg-surface/70 px-5 py-8 md:flex lg:w-72">
      <Link href="/home" className="px-2">
        <Logo />
      </Link>

      <nav aria-label={m.nav.label} className="mt-10">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map(({ href, labelKey, Icon }) => {
            const label = m.nav[labelKey];
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition ${
                    active ? "text-violet-deep" : "text-ink-soft hover:bg-cream-deep hover:text-ink"
                  }`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full border-2 transition ${
                      active ? "border-violet bg-violet text-white shadow-[0_6px_16px_-4px_rgb(91_140_123_/_0.55)]" : "border-violet/20 text-violet"
                    }`}
                  >
                    <Icon width={18} height={18} />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-2">
        <LanguageSwitch />
      </div>
    </aside>
  );
}
