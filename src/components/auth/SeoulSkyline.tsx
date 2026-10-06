/**
 * A faint Seoul silhouette for the welcome panel: city blocks in the back, Namsan hill with N Seoul
 * Tower, and a hanok gate and pavilion in front. White at low opacity so it reads as atmosphere,
 * never competing with the welcome text. Sits on the panel's bottom edge.
 */
export function SeoulSkyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice" className={`pointer-events-none w-full ${className}`} aria-hidden="true">
      {/* far city blocks */}
      <g fill="#ffffff" opacity="0.08">
        <rect x="0" y="92" width="22" height="58" />
        <rect x="26" y="78" width="16" height="72" />
        <rect x="46" y="98" width="24" height="52" />
        <rect x="150" y="84" width="18" height="66" />
        <rect x="172" y="70" width="14" height="80" />
        <rect x="190" y="94" width="26" height="56" />
        <rect x="340" y="88" width="20" height="62" />
        <rect x="364" y="74" width="16" height="76" />
        <rect x="384" y="96" width="16" height="54" />
      </g>

      {/* Namsan hill and N Seoul Tower */}
      <g fill="#ffffff" opacity="0.16">
        <path d="M200 150C235 112 270 96 300 94S360 108 400 124V150Z" />
        <path d="M296.5 40h7l1.5 56h-10z" />
        <rect x="288" y="44" width="24" height="9" rx="3.5" />
        <rect x="291" y="56" width="18" height="4" rx="2" />
        <rect x="299.2" y="14" width="1.6" height="30" />
        <circle cx="300" cy="13" r="1.8" />
      </g>

      {/* hanok pavilion (back) and gate (front) with up-turned eaves */}
      <g fill="#ffffff" opacity="0.2">
        <path d="M112 112Q130 110 138 101H196Q204 110 222 112L218 115Q167 108 116 115Z" />
        <rect x="132" y="115" width="70" height="35" />
      </g>
      <g fill="#ffffff" opacity="0.26">
        <path d="M6 116Q34 113 46 101L58 96H118L130 101Q142 113 170 116L165 120Q88 109 11 120Z" />
        <path d="M54 96Q88 88 122 96Z" />
        <rect x="30" y="120" width="116" height="30" />
      </g>
      {/* gate opening */}
      <path d="M76 150V134Q88 124 100 134V150Z" fill="#3a4a93" opacity="0.35" />
    </svg>
  );
}
