/** Shared radial progress chart for the Daily/Weekly/Monthly/Yearly panels. */
export function ProgressRing({
  pct,
  label,
  accent = "var(--color-violet)",
  size = 112,
}: {
  pct: number;
  label?: string;
  accent?: string;
  size?: number;
}) {
  const stroke = Math.round(size * 0.09);
  const r = (size - stroke) / 2;
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-line" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={accent}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 - clamped}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-xl font-bold text-ink" dir="ltr">
          {clamped}%
        </span>
        {label && <span className="mt-0.5 max-w-[5.5rem] text-center text-[10px] leading-tight text-ink-soft">{label}</span>}
      </div>
    </div>
  );
}
