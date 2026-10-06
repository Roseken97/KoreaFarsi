import { useId } from "react";

const TONES = {
  // Brand palette: muted celadon and a warm dusty rose, with a gold accent.
  celadon: { light: "#e6f1ec", mid: "#a8cbbd", dark: "#5b8c7b", ink: "#3f6657", dot: "#e6b3a6" },
  rose: { light: "#f8e8e2", mid: "#e3b0a2", dark: "#c17a6a", ink: "#96573a", dot: "#a8cbbd" },
};

/**
 * Hexagon hero panel for the auth screens, after the soft-3D login reference: a tinted rounded
 * hexagon holding a floating Hangul tile on a small pedestal, with a few floating spheres.
 */
export function AuthHero({ tone, letter }: { tone: keyof typeof TONES; letter: string }) {
  const uid = useId();
  const t = TONES[tone];
  const id = (k: string) => `${uid}-${k}`;
  const hex = "100,26 157,59 157,125 100,158 43,125 43,59";

  return (
    <div
      className="relative mb-7 overflow-hidden rounded-[32px] px-6 pt-7 pb-10"
      style={{ background: `linear-gradient(160deg, ${t.light} 0%, ${t.light} 45%, ${t.mid} 140%)` }}
      aria-hidden="true"
    >
      {/* fine dot grid so the panel reads as its own surface */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: `radial-gradient(${t.mid} 1px, transparent 1.2px)`, backgroundSize: "16px 16px" }}
      />
      <div className="absolute -top-10 -right-10 size-36 rounded-full bg-white/40 blur-2xl" />
      <svg viewBox="0 0 200 184" className="relative mx-auto w-44 overflow-visible">
        <defs>
          <linearGradient id={id("hex")} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={t.light} />
            <stop offset="100%" stopColor={t.mid} />
          </linearGradient>
          <linearGradient id={id("tile")} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1ece4" />
          </linearGradient>
          <linearGradient id={id("disc")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={t.light} />
          </linearGradient>
          <radialGradient id={id("gold")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fbefd2" />
            <stop offset="100%" stopColor="#c99a3e" />
          </radialGradient>
          <radialGradient id={id("dot")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={t.dot} />
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
        <circle cx="170" cy="150" r="9" fill={`url(#${id("dot")})`} />
        <circle cx="172" cy="40" r="5" fill="#fff" opacity="0.9" />
      </svg>
      {/* wave edge that hands off to the milk-white page */}
      <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-8 w-full">
        <path d="M0 40V22C70 2 130 2 200 18S330 36 400 14V40Z" fill="#fbf9f4" />
      </svg>
    </div>
  );
}
