import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * Screen header from the sketches: logo at the start, actions at the end.
 * On desktop the sidebar already shows the logo, so only the actions remain.
 */
export function PageHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4 md:mb-8 md:justify-end">
      <Link href="/home" className="md:hidden" aria-label="KoreaFarsi">
        <Logo size={34} />
      </Link>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function HeaderIconLink({ href, label, children, badge = false }: { href: string; label: string; children: ReactNode; badge?: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-soft transition hover:text-ink"
    >
      {children}
      {badge && <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-surface" aria-hidden="true" />}
    </Link>
  );
}
