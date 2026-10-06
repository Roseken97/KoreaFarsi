export function AuthHeader({ title, subtitle, center }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <header className={center ? "mb-7 text-center" : "mb-8"}>
      <h1 className={`font-display font-semibold text-ink ${center ? "text-[28px] font-bold" : "text-3xl"}`}>{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] leading-7 text-ink-soft">{subtitle}</p>}
    </header>
  );
}
