/** Delicate cherry-blossom branch accent (UX_SPECS: sakura as an identity touch, not filler). */
export function SakuraBranch({ className = "" }: { className?: string }) {
  const blossom = (cx: number, cy: number, r: number, rot = 0) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.62} ry={r} transform={`rotate(${a})`} className="fill-blush/70" />
      ))}
      <circle r={r * 0.35} className="fill-ink/40" />
    </g>
  );

  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <path
        d="M160 18 C128 22 104 34 84 52 C68 66 50 74 26 78 M112 30 C114 44 110 54 102 62 M84 52 C92 64 94 78 90 92"
        className="fill-none stroke-ink/35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {blossom(28, 76, 6, 10)}
      {blossom(60, 66, 7.5, -20)}
      {blossom(102, 62, 6.5, 30)}
      {blossom(90, 92, 5.5, 5)}
      {blossom(128, 26, 5, -10)}
      <ellipse cx="44" cy="102" rx="4" ry="2.4" transform="rotate(-25 44 102)" className="fill-blush/50" />
      <ellipse cx="120" cy="104" rx="3.4" ry="2" transform="rotate(18 120 104)" className="fill-blush/40" />
    </svg>
  );
}
