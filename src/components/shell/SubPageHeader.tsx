import Link from "next/link";
import { ChevronIcon } from "@/components/icons";

/** Back button + title for pages nested under a main section. */
export function SubPageHeader({ title, backHref, backLabel }: { title: string; backHref: string; backLabel: string }) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <Link
        href={backHref}
        aria-label={backLabel}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft hover:text-ink"
      >
        <ChevronIcon width={18} height={18} className="rotate-180" />
      </Link>
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
    </header>
  );
}
