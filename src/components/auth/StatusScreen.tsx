import type { ReactNode } from "react";

/** Centered icon + title + body used for "check your email", "link sent" and "You're In!". */
export function StatusScreen({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-white text-violet shadow-[0_14px_30px_-14px_rgb(117_80_170/0.5)]">{icon}</span>
      <h1 className="mt-6 font-display text-[26px] font-bold text-ink">{title}</h1>
      {children && <div className="mt-3 text-[15px] leading-7 text-ink-soft">{children}</div>}
      {action && <div className="mt-8 w-full">{action}</div>}
    </div>
  );
}
