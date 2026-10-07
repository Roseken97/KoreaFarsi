import { useId } from "react";
import { BLUSH, CREAM_SHADE, Defs, type IllustrationProps, KR_FONT, LAVENDER, MINT, NAVY, PERIWINKLE, SAND, Sparkle } from "./kit";

/**
 * Soft-3D art for the four Home section cards, shown when no photo is uploaded
 * for the card in Admin → Card photos. Wide 200×130 frames that sit between
 * the card's top chips and its title.
 */

/** My courses: a lesson on a tablet (play button, progress bar) leaning on a stack of books. */
export function CoursesArt(props: IllustrationProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 130" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <ellipse cx="100" cy="70" rx="80" ry="56" fill={`url(#${id}-glow)`} />
      {/* books */}
      <rect x="110" y="96" width="70" height="16" rx="5" fill={BLUSH} />
      <rect x="116" y="80" width="62" height="16" rx="5" fill={`url(#${id}-body)`} />
      <rect x="106" y="64" width="66" height="16" rx="5" fill={SAND} />
      <path d="M122 72h30M128 88h34M124 104h40" stroke={NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.18" />
      {/* tablet */}
      <g transform="rotate(-6 76 72)">
        <rect x="26" y="24" width="98" height="78" rx="14" fill={`url(#${id}-body)`} />
        <rect x="34" y="32" width="82" height="52" rx="8" fill={PERIWINKLE} />
        <rect x="34" y="32" width="82" height="20" rx="8" fill="#FFFFFF" opacity="0.25" />
        <circle cx="75" cy="58" r="14" fill="#FFFFFF" />
        <path d="M71 51v14l12-7Z" fill={NAVY} />
        <rect x="36" y="90" width="78" height="5" rx="2.5" fill={CREAM_SHADE} />
        <rect x="36" y="90" width="46" height="5" rx="2.5" fill={NAVY} opacity="0.75" />
      </g>
      <Sparkle x={176} y={36} s={0.8} />
      <Sparkle x={22} y={112} s={0.6} />
    </svg>
  );
}

/** Bookstore: three standing books with Hangul spines and a little shopping bag. */
export function BookstoreArt(props: IllustrationProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 130" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <ellipse cx="100" cy="70" rx="80" ry="56" fill={`url(#${id}-glow)`} />
      <rect x="30" y="114" width="120" height="6" rx="3" fill="#FFFFFF" opacity="0.6" />
      {/* books */}
      <g>
        <rect x="40" y="30" width="30" height="84" rx="6" fill={`url(#${id}-body)`} />
        <rect x="40" y="30" width="30" height="20" rx="6" fill={`url(#${id}-gloss)`} />
        <text x="55" y="80" textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY} fontFamily={KR_FONT} writingMode="tb">
          한글
        </text>
        <rect x="72" y="42" width="26" height="72" rx="6" fill={LAVENDER} />
        <rect x="76" y="54" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
        <rect x="76" y="98" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
        <g transform="rotate(12 118 76)">
          <rect x="104" y="38" width="28" height="78" rx="6" fill={SAND} />
          <text x="118" y="86" textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY} fontFamily={KR_FONT}>
            책
          </text>
        </g>
      </g>
      {/* bag */}
      <g>
        <path d="M150 74a12 12 0 0 1 24 0" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <rect x="140" y="72" width="44" height="44" rx="10" fill={`url(#${id}-body)`} />
        <rect x="140" y="72" width="44" height="14" rx="7" fill={`url(#${id}-gloss)`} />
        <path d="M153 96l6 6 12-12" stroke={BLUSH} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={168} y={34} s={0.8} />
      <Sparkle x={24} y={52} s={0.6} />
    </svg>
  );
}

/** AI assistant: a glowing answer bubble with sparkles and a small question bubble. */
export function AiHubArt(props: IllustrationProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 130" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <ellipse cx="100" cy="70" rx="80" ry="56" fill={`url(#${id}-glow)`} />
      {/* question */}
      <path d="M30 26h40a14 14 0 0 1 14 14v12a14 14 0 0 1-14 14H52l-14 10 2-10h-10a14 14 0 0 1-14-14V40a14 14 0 0 1 14-14Z" fill={SAND} />
      <text x="50" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill={NAVY}>
        ?
      </text>
      {/* answer */}
      <path d="M86 40h76a20 20 0 0 1 20 20v28a20 20 0 0 1-20 20h-8l6 16-24-16h-50a20 20 0 0 1-20-20V60a20 20 0 0 1 20-20Z" fill={`url(#${id}-body)`} />
      <path d="M86 40h76a20 20 0 0 1 20 20v4H66v-4a20 20 0 0 1 20-20Z" fill={`url(#${id}-gloss)`} />
      <path
        d="M108 56c2 9 5 12 14 14-9 2-12 5-14 14-2-9-5-12-14-14 9-2 12-5 14-14Z"
        fill={LAVENDER}
      />
      <rect x="132" y="62" width="34" height="6" rx="3" fill={NAVY} opacity="0.75" />
      <rect x="132" y="76" width="24" height="6" rx="3" fill={NAVY} opacity="0.3" />
      <Sparkle x={176} y={28} s={0.9} />
      <Sparkle x={34} y={104} s={0.7} fill={BLUSH} />
    </svg>
  );
}

/** Life in Korea: a hanok roof under N Seoul Tower, with a glowing lantern. */
export function KoreaLifeArt(props: IllustrationProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 130" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <ellipse cx="100" cy="70" rx="80" ry="56" fill={`url(#${id}-glow)`} />
      {/* hill and tower */}
      <path d="M100 118c10-30 34-44 60-44s38 18 40 44Z" fill="#FFFFFF" opacity="0.45" />
      <rect x="153" y="30" width="6" height="50" rx="3" fill="#FFFFFF" />
      <rect x="146" y="44" width="20" height="9" rx="4.5" fill={`url(#${id}-body)`} />
      <circle cx="156" cy="24" r="4" fill={BLUSH} />
      {/* hanok */}
      <g>
        <rect x="36" y="76" width="86" height="40" rx="6" fill={`url(#${id}-body)`} />
        <rect x="68" y="88" width="22" height="28" rx="4" fill={SAND} />
        <rect x="44" y="86" width="16" height="14" rx="3" fill={MINT} />
        <rect x="98" y="86" width="16" height="14" rx="3" fill={MINT} />
        <path d="M20 74c18 2 30-14 59-22 29 8 41 24 59 22-4 8-14 10-22 10H42c-8 0-18-2-22-10Z" fill={NAVY} opacity="0.85" />
        <path d="M34 72c14 0 26-10 45-16 19 6 31 16 45 16" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      </g>
      {/* lantern */}
      <g>
        <path d="M178 58v10" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="168" y="68" width="20" height="28" rx="10" fill={BLUSH} />
        <rect x="170" y="66" width="16" height="4" rx="2" fill={NAVY} opacity="0.7" />
        <rect x="170" y="94" width="16" height="4" rx="2" fill={NAVY} opacity="0.7" />
        <rect x="172" y="72" width="5" height="16" rx="2.5" fill="#FFFFFF" opacity="0.6" />
      </g>
      <Sparkle x={30} y={34} s={0.8} />
      <Sparkle x={118} y={26} s={0.55} />
    </svg>
  );
}
