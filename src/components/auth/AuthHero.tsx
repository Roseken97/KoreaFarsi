import { useId } from "react";

const TONES = {
  violet: { light: "#ddd0ff", mid: "#ad8cff", dark: "#7b52e8", ink: "#5d3bc4" },
  blush: { light: "#ffdbe9", mid: "#f59bc2", dark: "#e85a9f", ink: "#b83677" },
};

/**
 * Hexagon hero for the auth screens, after the soft-3D login reference: a tinted rounded
 * hexagon holding a floating Hangul tile on a small pedestal, with a few floating spheres.
 */
export function AuthHero({ tone, letter }: { tone: keyof typeof TONES; letter: string }) {
  const uid = useId();
  const t = TONES[tone];
  const id = (k: string) => `${uid}-${k}`;
  const hex = "100,26 157,59 157,125 100,158 43,125 43,59";

  return (
    <div className="relative mx-auto mb-6 w-48" aria-hidden="true">
      <div className="absolute inset-6 rounded-full blur-2xl" style={{ background: t.mid, opacity: 0.45 }} />
      <svg viewBox="0 0 200 184" className="relative w-full overflow-visible">
        <defs>
          <linearGradient id={id("hex")} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={t.light} />
            <stop offset="100%" stopColor={t.mid} />
          </linearGradient>
          <linearGradient id={id("tile")} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8e6f0" />
          </linearGradient>
          <linearGradient id={id("disc")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={t.light} />
          </linearGradient>
          <radialGradient id={id("gold")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff1c2" />
            <stop offset="100%" stopColor="#f2a516" />
          </radialGradient>
          <radialGradient id={id("teal")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#d9fbf6" />
            <stop offset="100%" stopColor="#20b8b0" />
          </radialGradient>
        </defs>

        {/* rounded hexagon: same-color stroke with round joins softens the corners */}
        <polygon points={hex} fill={`url(#${id("hex")})`} stroke={`url(#${id("hex")})`} strokeWidth="22" strokeLinejoin="round" />
        <polygon points={hex} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" transform="translate(100 92) scale(0.86) translate(-100 -92)" />

        {/* pedestal */}
        <ellipse cx="100" cy="134" rx="40" ry="10" fill={t.dark} opacity="0.35" />
        <ellipse cx="100" cy="128" rx="40" ry="10" fill={`url(#${id("disc")})`} />

        {/* floating Hangul tile */}
        <g transform="rotate(-8 100 88)">
          <rect x="66" y="56" width="68" height="68" rx="18" fill={t.dark} opacity="0.25" transform="translate(3 6)" />
          <rect x="66" y="56" width="68" height="68" rx="18" fill={`url(#${id("tile")})`} />
          <ellipse cx="88" cy="64" rx="14" ry="3.5" fill="#fff" />
          <text
            x="100"
            y="104"
            textAnchor="middle"
            fontSize="40"
            fontWeight="800"
            fill={t.ink}
            fontFamily="'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
          >
            {letter}
          </text>
        </g>

        {/* floating spheres */}
        <circle cx="34" cy="34" r="13" fill={`url(#${id("gold")})`} />
        <circle cx="170" cy="150" r="9" fill={`url(#${id("teal")})`} />
        <circle cx="172" cy="40" r="5" fill="#fff" opacity="0.9" />
      </svg>
    </div>
  );
}
