/** Centered sheet title in navy, with an optional short line under it. */
export function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 text-center">
      <h1 className="font-display text-[26px] font-bold text-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-sm leading-6 text-ink-soft">{subtitle}</p>}
    </header>
  );
}
