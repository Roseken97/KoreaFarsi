import { useId } from "react";
import { BLUSH, CREAM_SHADE, Defs, type IllustrationProps, KR_FONT, LAVENDER, MINT, NAVY, SAND, Sparkle } from "./kit";

/** App guide: a folded map with a dotted route to a pin, and a "길" (way) tag. */
export function GuideArt(props: IllustrationProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 130" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <ellipse cx="100" cy="70" rx="80" ry="56" fill={`url(#${id}-glow)`} />
      {/* folded map: three panels */}
      <g transform="rotate(-4 96 78)">
        <path d="M30 40l44-10v76l-44 10Z" fill={`url(#${id}-body)`} />
        <path d="M74 30l46 10v76l-46-10Z" fill={CREAM_SHADE} />
        <path d="M120 40l44-10v76l-44 10Z" fill={`url(#${id}-body)`} />
        <path d="M30 40l44-10v16l-44 10Z" fill={`url(#${id}-gloss)`} />
        <path d="M120 40l44-10v16l-44 10Z" fill={`url(#${id}-gloss)`} />
        {/* areas on the map */}
        <circle cx="52" cy="92" r="9" fill={MINT} />
        <rect x="128" y="74" width="24" height="16" rx="5" fill={LAVENDER} />
        {/* route */}
        <path d="M52 92c14-6 18-26 36-24s22 20 40 10 12-30 20-36" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 8" opacity="0.6" />
      </g>
      {/* pin */}
      <g transform="translate(150 30)">
        <path d="M0 26C-12 12-16 4-16-4a16 16 0 0 1 32 0c0 8-4 16-16 30Z" fill={BLUSH} />
        <circle cy="-4" r="6" fill="#FFFFFF" />
      </g>
      {/* tag */}
      <g transform="rotate(-8 46 26)">
        <rect x="22" y="12" width="48" height="28" rx="14" fill={SAND} />
        <text x="46" y="32" textAnchor="middle" fontSize="17" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          길
        </text>
      </g>
      <Sparkle x={184} y={84} s={0.8} />
      <Sparkle x={18} y={110} s={0.6} />
    </svg>
  );
}
