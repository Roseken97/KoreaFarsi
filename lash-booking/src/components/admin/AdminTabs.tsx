"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/settings/admin", label: "نوبت‌ها" },
  { href: "/settings/admin/services", label: "خدمات و قیمت" },
  { href: "/settings/admin/schedule", label: "ساعات کاری" },
  { href: "/settings/admin/general", label: "تنظیمات سالن" },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto px-4">
      {TABS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              active ? "bg-ink text-white" : "bg-surface text-ink-soft shadow-soft hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
