/**
 * Subtle Seoul silhouette for the bottom of the splash (UX_SPECS 01):
 * layered hills, N Seoul Tower on Namsan and a traditional hanok roof.
 * Hills stretch to any width; landmarks keep their proportions and stay centered.
 * Decorative only; colors come from brand tokens at low opacity.
 */
export function SeoulSkyline({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path
          d="M0 112 C40 92 70 96 104 84 C140 72 170 90 200 80 C236 68 262 58 296 74 C326 88 360 80 400 70 V160 H0Z"
          className="fill-sage/25"
        />
      </svg>

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 size-full">
        {/* N Seoul Tower */}
        <g className="fill-ink/15">
          <rect x="285.5" y="22" width="1" height="14" />
          <path d="M282 36h8l-1 5h-6z" />
          <rect x="280" y="41" width="12" height="4" rx="1" />
          <path d="M283.5 45h5l1.5 32h-8z" />
        </g>
      </svg>

      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path
          d="M0 128 C50 112 88 120 130 110 C176 99 214 118 254 112 C300 105 340 120 400 108 V160 H0Z"
          className="fill-sage/35"
        />
      </svg>

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 size-full">
        {/* hanok roof with upturned eaves */}
        <g className="fill-ink/12">
          <path d="M56 116 C68 113 78 106 86 98 H138 C146 106 156 113 168 116 C150 117 142 115 136 112 H88 C82 115 74 117 56 116Z" />
          <rect x="92" y="112" width="40" height="14" />
          <rect x="104" y="92" width="16" height="6" rx="1" />
        </g>
        <g className="fill-blush/50">
          <ellipse cx="46" cy="70" rx="3" ry="1.8" transform="rotate(-30 46 70)" />
          <ellipse cx="236" cy="46" rx="2.6" ry="1.5" transform="rotate(20 236 46)" />
          <ellipse cx="352" cy="58" rx="3" ry="1.8" transform="rotate(-15 352 58)" />
        </g>
      </svg>

      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d="M0 140 C80 130 150 138 220 134 C290 130 340 138 400 132 V160 H0Z" className="fill-cream-deep" />
      </svg>
    </div>
  );
}
