"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { NAV_ITEMS, isActive } from "./nav-items";

// Desktop keeps Home first: the "center slot" is a thumb-reach pattern that
// only makes sense on the mobile bottom bar.
const SIDEBAR_ITEMS = [
  ...NAV_ITEMS.filter((i) => i.href === "/home"),
  ...NAV_ITEMS.filter((i) => i.href !== "/home"),
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-l border-line/70 bg-surface/70 px-5 py-8 md:flex lg:w-72">
      <Link href="/home" className="px-2">
        <Logo />
      </Link>

      <nav aria-label="ناوبری اصلی" className="mt-10">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
                    active ? "bg-sage-soft text-teal-deep" : "text-ink-soft hover:bg-cream-deep hover:text-ink"
                  }`}
                >
                  <Icon width={22} height={22} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="mt-auto px-2 text-xs leading-6 text-ink-faint">
        آموزش زبان کره‌ای برای فارسی‌زبانان
      </p>
    </aside>
  );
}
