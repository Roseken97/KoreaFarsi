import Link from "next/link";

export type CalendarStripItem = { key: string; label: string; sub?: string; href: string; active: boolean };

/** Horizontally scrollable chip strip shared by the Daily/Weekly/Monthly/Yearly panels — day, week, month or year chips depending on the panel. */
export function CalendarStrip({ items }: { items: CalendarStripItem[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2">
        {items.map((it) => (
          <Link
            key={it.key}
            href={it.href}
            scroll={false}
            className={`flex min-w-14 shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-center transition ${
              it.active ? "bg-violet text-white shadow-soft" : "bg-surface text-ink-soft hover:text-ink"
            }`}
          >
            {it.sub && <span className="text-[11px] font-medium">{it.sub}</span>}
            <span className="text-sm font-bold" dir="ltr">
              {it.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
