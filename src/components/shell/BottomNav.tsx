"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { motion } from "motion/react";
import { NAV_ITEMS, isActive } from "./nav-items";
import { NAV_PALETTE, NavIcon3D } from "./NavIcon3D";

export function BottomNav() {
  const pathname = usePathname();
  const { m } = useI18n();

  return (
    <nav aria-label={m.nav.label} className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden">
      <ul className="mx-auto flex max-w-lg items-end justify-around rounded-hero border border-line/60 bg-surface/95 px-2 pt-7 pb-2.5 shadow-lift backdrop-blur-xl">
        {NAV_ITEMS.map(({ href, labelKey }) => {
          const label = m.nav[labelKey];
          const active = isActive(pathname, href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1.5"
              >
                {/* Soft 3D icon: grey when idle; when active it takes its own color, grows and pops out of the bar. */}
                <motion.span
                  key={active ? "on" : "off"}
                  initial={active ? { y: 10, scale: 0.7 } : false}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className={
                    active
                      ? "-mt-12 grid size-14 place-items-center drop-shadow-[0_10px_14px_rgb(30_35_64/0.22)]"
                      : "grid size-7 place-items-center"
                  }
                >
                  <NavIcon3D name={labelKey} active={active} size={active ? 56 : 28} />
                </motion.span>
                <span
                  className={`text-[11px] ${active ? "font-bold" : "font-medium text-ink-faint"}`}
                  style={active ? { color: NAV_PALETTE[labelKey].deep } : undefined}
                >
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
