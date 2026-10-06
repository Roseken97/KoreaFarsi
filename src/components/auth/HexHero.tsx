import { useId } from "react";

const TONES = {
  lavender: { light: "#ece2f7", mid: "#ae8ad2", dark: "#7550aa", ink: "#7550aa" },
  rose: { light: "#fde0e0", mid: "#f8a8a8", dark: "#b24e58", ink: "#b24e58" },
  periwinkle: { light: "#dfe5fb", mid: "#7690ea", dark: "#3a4a93", ink: "#3a4a93" },
};

export type HexTone = keyof typeof TONES;

const HEX = "100,22 160,57 160,127 100,162 40,127 40,57";

/**
 * Rounded hexagon hero from the soft-3D sign-in reference. Shows Rose's uploaded 3D render
 * (Admin → Card photos) clipped to the hexagon; without one, a floating Hangul tile on a
 * pedestal stands in.
 */
export function HexHero({ tone, image, letter, className = "" }: { tone: HexTone; image?: string; letter: string; className?: string }) {
  const uid = useId();
  const t = TONES[tone];
  const id = (k: string) => `${uid}-${k}`;

  return (
    <div className={`relative mx-auto w-52 ${className}`} aria-hidden="true">
      <div className="absolute inset-8 rounded-full blur-2xl" style={{ background: t.mid, opacity: 0.5 }} />
      <svg viewBox="0 0 200 184" className="relative w-full overflow-visible">
        <defs>
          <linearGradient id={id("hex")} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={t.light} />
            <stop offset="100%" stopColor={t.mid} />
          </linearGradient>
          <linearGradient id={id("tile")} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ebe7f2" />
          </linearGradient>
          <linearGradient id={id("disc")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={t.light} />
          </linearGradient>
          <radialGradient id={id("pearl")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d1b6e7" />
          </radialGradient>
          <radialGradient id={id("mint")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#7fd9c2" />
          </radialGradient>
          {/* a same-color stroke with round joins gives the hexagon its soft corners */}
          <mask id={id("clip")}>
            <polygon points={HEX} fill="#fff" stroke="#fff" strokeWidth="22" strokeLinejoin="round" />
          </mask>
        </defs>

        <polygon points={HEX} fill={`url(#${id("hex")})`} stroke={`url(#${id("hex")})`} strokeWidth="22" strokeLinejoin="round" />

        {image ? (
          <image href={image} x="18" y="0" width="164" height="184" preserveAspectRatio="xMidYMid slice" mask={`url(#${id("clip")})`} />
        ) : (
          <>
            <polygon
              points={HEX}
              fill="none"
              stroke="#fff"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinejoin="round"
              transform="translate(100 92) scale(0.86) translate(-100 -92)"
            />
            <ellipse cx="100" cy="136" rx="42" ry="10" fill={t.dark} opacity="0.3" />
            <ellipse cx="100" cy="130" rx="42" ry="10" fill={`url(#${id("disc")})`} />
            <g transform="rotate(-8 100 88)">
              <rect x="66" y="54" width="68" height="68" rx="18" fill={t.dark} opacity="0.25" transform="translate(3 6)" />
              <rect x="66" y="54" width="68" height="68" rx="18" fill={`url(#${id("tile")})`} />
              <ellipse cx="88" cy="62" rx="14" ry="3.5" fill="#fff" />
              <text
                x="100"
                y="102"
                textAnchor="middle"
                fontSize="40"
                fontWeight="800"
                fill={t.ink}
                fontFamily="'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
              >
                {letter}
              </text>
            </g>
          </>
        )}

        <circle className="kf-float" cx="30" cy="36" r="13" fill={`url(#${id("pearl")})`} />
        <circle className="kf-float" style={{ animationDelay: "-2s" }} cx="172" cy="150" r="9" fill={`url(#${id("mint")})`} />
        <circle cx="174" cy="38" r="5" fill="#fff" opacity="0.9" />
      </svg>
    </div>
  );
}
