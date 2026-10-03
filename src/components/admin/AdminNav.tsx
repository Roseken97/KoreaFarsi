import Link from "next/link";

const TABS = [
  { key: "products", href: "/admin/products", label: "Products" },
  { key: "courses", href: "/admin/courses", label: "Courses" },
  { key: "announcements", href: "/admin/announcements", label: "Announcements" },
  { key: "korealife", href: "/admin/korea-life", label: "Korea Life" },
  { key: "tickets", href: "/admin/tickets", label: "Tickets" },
  { key: "orders", href: "/admin/orders", label: "Orders" },
  { key: "knowledge", href: "/admin/knowledge", label: "Knowledge base" },
] as const;

/** Simple tab strip between the two internal admin pages. English-only (admin tool, not learner-facing). */
export function AdminNav({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav className="-mx-4 mb-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
              tab.key === active ? "bg-violet text-white" : "border border-line bg-surface text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
