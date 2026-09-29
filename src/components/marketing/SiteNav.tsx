"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

type NavItem = { key: string; label: string; href: string };

/**
 * Marketing header nav: inline links on desktop, a hamburger + slide-down
 * panel on mobile so every section stays reachable without scrolling.
 */
export function SiteNav({
  items,
  featuresLabel,
  loginLabel,
  startLabel,
  menuLabel,
  closeLabel,
}: {
  items: NavItem[];
  featuresLabel: string;
  loginLabel: string;
  startLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const allLinks: NavItem[] = [{ key: "features", label: featuresLabel, href: "#features" }, ...items];

  return (
    <>
      <nav className="hidden items-center gap-6 md:flex">
        {allLinks.map((item) => (
          <Link key={item.key} href={item.href} className="text-sm font-medium text-ink-soft transition hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={menuLabel}
          className="grid size-10 place-items-center rounded-full bg-surface/70 text-ink shadow-soft backdrop-blur"
        >
          <MenuIcon width={20} height={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute inset-x-4 top-4 rounded-[28px] bg-surface/95 p-6 shadow-lift backdrop-blur-xl"
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-ink">{menuLabel}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={closeLabel}
                  className="grid size-9 place-items-center rounded-full bg-sage-soft text-teal-deep"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-1">
                {allLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-3 py-3 text-[15px] font-medium text-ink transition hover:bg-sage-soft"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-line/70 pt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-ink-soft"
                >
                  {loginLabel}
                </Link>
                <Link
                  href="/auth/welcome"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-teal px-4 py-2.5 text-center text-sm font-semibold text-white shadow-soft"
                >
                  {startLabel}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
