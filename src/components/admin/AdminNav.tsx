import Link from "next/link";

const TABS = [
  { key: "products", href: "/admin/products", label: "Products" },
  { key: "orders", href: "/admin/orders", label: "Orders" },
  { key: "knowledge", href: "/admin/knowledge", label: "Knowledge base" },
] as const;

/** Simple tab strip between the two internal admin pages. English-only (admin tool, not learner-facing). */
export function AdminNav({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav className="mb-6 flex gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            tab.key === active ? "bg-ink text-cream" : "border border-line bg-surface text-ink-soft hover:text-ink"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
