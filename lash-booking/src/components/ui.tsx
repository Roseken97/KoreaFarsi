import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Small shared building blocks. Kept in one file on purpose: the app is small.

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto w-full px-4 pb-16 ${wide ? "max-w-5xl" : "max-w-xl"}`} style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}>
      {children}
    </div>
  );
}

export function TopBar({ title, back, right }: { title: ReactNode; back?: string; right?: ReactNode }) {
  return (
    <header className="flex h-16 items-center gap-3">
      {back && (
        <Link
          href={back}
          aria-label="بازگشت"
          className="grid size-10 place-items-center rounded-full bg-surface text-ink shadow-soft transition hover:text-rose-deep"
        >
          <Icon name="chevron-right" />
        </Link>
      )}
      <div className="min-w-0 flex-1 truncate text-lg font-bold">{title}</div>
      {right}
    </header>
  );
}

export function Card({ className = "", ...p }: ComponentProps<"div">) {
  return <div className={`rounded-card bg-surface p-5 shadow-soft ${className}`} {...p} />;
}

export function SectionTitle({ step, children, hint }: { step?: number; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      {step !== undefined && (
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-rose text-xs font-bold text-white">
          {"۰۱۲۳۴۵۶۷۸۹"[step]}
        </span>
      )}
      <h2 className="text-base font-bold">{children}</h2>
      {hint && <span className="ms-auto text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-faint focus:border-rose focus:ring-4 focus:ring-rose-soft";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-deep px-5 py-3.5 text-base font-bold text-white shadow-lift transition hover:bg-rose active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:border-rose hover:text-rose-deep disabled:opacity-50";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink-soft">
        {label}
        {hint && <span className="text-xs font-normal text-ink-faint">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-danger">{error}</span>}
    </label>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "قطعی", cls: "bg-ok-soft text-ok" },
  completed: { label: "انجام شد", cls: "bg-rose-soft text-rose-deep" },
  pending: { label: "در انتظار پرداخت", cls: "bg-warn-soft text-warn" },
  expired: { label: "پرداخت نشد", cls: "bg-line text-ink-soft" },
  cancelled: { label: "لغو شده", cls: "bg-line text-ink-soft" },
  needs_refund: { label: "نیاز به پیگیری", cls: "bg-danger-soft text-danger" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: "bg-line text-ink-soft" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

type IconName =
  | "settings"
  | "chevron-right"
  | "chevron-left"
  | "check"
  | "clock"
  | "calendar"
  | "phone"
  | "pin"
  | "lock"
  | "search"
  | "instagram"
  | "sparkle"
  | "x"
  | "alert"
  | "logout"
  | "plus";

const PATHS: Record<IconName, ReactNode> = {
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".5" />
    </>
  ),
  sparkle: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
