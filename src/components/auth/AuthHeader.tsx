export function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] leading-7 text-ink-soft">{subtitle}</p>}
    </header>
  );
}
