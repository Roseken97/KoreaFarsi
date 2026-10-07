import { useId } from "react";
import { BLUSH, CREAM_SHADE, Defs, type IllustrationProps, KR_FONT, LAVENDER, MINT, NAVY, PERIWINKLE, SAND, Sparkle } from "./kit";

/**
 * Soft-3D scenes for the onboarding slides, shown when a slide has no photo
 * uploaded in /admin/onboarding. Each is tinted by its slide's palette color
 * (`base`) so the same scene works if Rose recolors a slide.
 */
type SceneProps = IllustrationProps & { base: string };

/** 1 · A new journey: a winding path up to a Korean gate, a paper plane and a 안녕! bubble. */
export function JourneyScene({ base, ...props }: SceneProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 360 400" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="180" cy="190" r="170" fill={base} opacity="0.35" />
      <circle cx="272" cy="96" r="34" fill="#FFFFFF" opacity="0.9" />
      {/* hills */}
      <path d="M0 300c60-60 130-80 190-70s120 40 170 20v150H0Z" fill="#FFFFFF" opacity="0.7" />
      <path d="M0 330c80-30 150-34 220-20s100 20 140 6v84H0Z" fill={`url(#${id}-body)`} />
      {/* path */}
      <path d="M150 400c10-40 70-50 60-90s-60-34-40-70 40-28 40-28" stroke={base} strokeWidth="26" strokeLinecap="round" />
      <path d="M150 400c10-40 70-50 60-90s-60-34-40-70 40-28 40-28" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 16" />
      {/* gate */}
      <g>
        <rect x="174" y="150" width="12" height="70" rx="4" fill={NAVY} opacity="0.85" />
        <rect x="234" y="150" width="12" height="70" rx="4" fill={NAVY} opacity="0.85" />
        <rect x="168" y="158" width="84" height="10" rx="5" fill={BLUSH} />
        <path d="M152 146c20 4 36-10 58-14 22 4 38 18 58 14-4 10-16 12-26 12h-64c-10 0-22-2-26-12Z" fill={NAVY} opacity="0.85" />
      </g>
      {/* greeting */}
      <g transform="rotate(-6 92 90)">
        <path d="M40 54h104a26 26 0 0 1 26 26v18a26 26 0 0 1-26 26H84l-26 20 4-20h-22a26 26 0 0 1-26-26V80a26 26 0 0 1 26-26Z" fill={`url(#${id}-body)`} />
        <path d="M40 54h104a26 26 0 0 1 26 26v6H14v-6a26 26 0 0 1 26-26Z" fill={`url(#${id}-gloss)`} />
        <text x="92" y="102" textAnchor="middle" fontSize="34" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          안녕!
        </text>
      </g>
      {/* paper plane */}
      <g transform="translate(286 200) rotate(-18)">
        <path d="M-34 0 34-22 4 24Z" fill={`url(#${id}-body)`} />
        <path d="M-34 0 34-22-6 8Z" fill="#FFFFFF" />
        <path d="M-6 8 4 24 6 4Z" fill={CREAM_SHADE} />
      </g>
      <path d="M244 236c-20 10-40 6-56 14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 9" />
      <Sparkle x={318} y={150} s={1.1} />
      <Sparkle x={52} y={210} s={0.9} />
      <Sparkle x={210} y={40} s={0.7} />
    </svg>
  );
}

/** 2 · Learn your way: an open book, a tablet lesson, headphones and a cup on one desk. */
export function StudyScene({ base, ...props }: SceneProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 360 400" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="180" cy="190" r="170" fill={base} opacity="0.3" />
      {/* desk */}
      <rect x="20" y="300" width="320" height="22" rx="11" fill={`url(#${id}-body)`} />
      <rect x="20" y="300" width="320" height="8" rx="4" fill="#FFFFFF" />
      {/* tablet on stand */}
      <g transform="rotate(-4 150 190)">
        <rect x="76" y="96" width="168" height="124" rx="18" fill={`url(#${id}-body)`} />
        <rect x="88" y="108" width="144" height="88" rx="10" fill={base} />
        <rect x="88" y="108" width="144" height="30" rx="10" fill="#FFFFFF" opacity="0.25" />
        <circle cx="160" cy="152" r="22" fill="#FFFFFF" />
        <path d="M153 140v24l20-12Z" fill={NAVY} />
        <rect x="92" y="204" width="136" height="6" rx="3" fill={CREAM_SHADE} />
        <rect x="92" y="204" width="80" height="6" rx="3" fill={NAVY} opacity="0.75" />
      </g>
      <path d="M150 222l-14 78M170 222l14 78" stroke={CREAM_SHADE} strokeWidth="8" strokeLinecap="round" />
      {/* open book */}
      <g>
        <path d="M110 298c-16-8-38-10-62-6v-46c24-4 46-2 62 6Z" fill={`url(#${id}-body)`} />
        <path d="M110 298c16-8 38-10 62-6v-46c-24-4-46-2-62 6Z" fill={SAND} />
        <path d="M110 252v46" stroke={NAVY} strokeWidth="2" opacity="0.2" />
        <text x="80" y="284" textAnchor="middle" fontSize="24" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          가
        </text>
        <path d="M122 266c12-4 26-5 40-4M122 280c12-4 26-5 40-4" stroke={NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      </g>
      {/* cup */}
      <g>
        <rect x="262" y="246" width="44" height="54" rx="12" fill={`url(#${id}-body)`} />
        <path d="M306 260a12 12 0 0 1 0 24" stroke={CREAM_SHADE} strokeWidth="7" />
        <rect x="262" y="262" width="44" height="10" fill={BLUSH} />
        <path d="M276 236c-6-8 6-12 0-20M292 236c-6-8 6-12 0-20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      </g>
      {/* headphones */}
      <g transform="translate(282 92) rotate(14)">
        <path d="M-30 20v-6a30 30 0 0 1 60 0v6" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        <rect x="-40" y="12" width="18" height="30" rx="9" fill={LAVENDER} />
        <rect x="22" y="12" width="18" height="30" rx="9" fill={LAVENDER} />
      </g>
      <Sparkle x={54} y={110} s={1} />
      <Sparkle x={316} y={190} s={0.8} />
      <Sparkle x={196} y={56} s={0.7} />
    </svg>
  );
}

/** 3 · Real practice, real progress: flashcards turning into rising steps toward a star. */
export function ProgressScene({ base, ...props }: SceneProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 360 400" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="180" cy="190" r="170" fill={base} opacity="0.3" />
      {/* steps */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={60 + i * 62} y={290 - i * 50} width="58" height={60 + i * 50} rx="12" fill={`url(#${id}-body)`} />
          <rect x={60 + i * 62} y={290 - i * 50} width="58" height="14" rx="7" fill="#FFFFFF" />
        </g>
      ))}
      <path d="M90 270l60-50 62-50 62-50" stroke={base} strokeWidth="6" strokeLinecap="round" strokeDasharray="2 12" />
      {/* star trophy */}
      <g transform="translate(274 96)">
        <circle r="34" fill={SAND} />
        <path d="M0-20 6-6 21-5 9 5 13 20 0 11-13 20-9 5-21-5-6-6Z" fill="#FFFFFF" />
      </g>
      {/* flashcards */}
      <g transform="rotate(-10 92 132)">
        <rect x="52" y="92" width="82" height="96" rx="16" fill={LAVENDER} />
        <rect x="44" y="84" width="82" height="96" rx="16" fill={`url(#${id}-body)`} />
        <text x="85" y="146" textAnchor="middle" fontSize="40" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          가
        </text>
      </g>
      <g transform="rotate(8 176 108)">
        <rect x="148" y="78" width="60" height="60" rx="14" fill={`url(#${id}-body)`} />
        <path d="M164 108l10 10 18-20" stroke={MINT} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="232" cy="300" r="10" fill={BLUSH} />
      <circle cx="120" cy="230" r="7" fill={PERIWINKLE} />
      <Sparkle x={318} y={170} s={1} />
      <Sparkle x={36} y={240} s={0.8} />
      <Sparkle x={224} y={46} s={0.7} />
    </svg>
  );
}

/** 4 · Be part of a bigger story: learners' chat bubbles linked around a shared heart. */
export function CommunityScene({ base, ...props }: SceneProps) {
  const id = useId();
  const people = [
    { x: 84, y: 120, c: SAND },
    { x: 276, y: 128, c: LAVENDER },
    { x: 90, y: 286, c: MINT },
    { x: 270, y: 290, c: PERIWINKLE },
  ];
  return (
    <svg viewBox="0 0 360 400" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="180" cy="200" r="170" fill={base} opacity="0.3" />
      {/* links */}
      <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 10">
        {people.map((p) => (
          <path key={`${p.x}`} d={`M180 205L${p.x} ${p.y}`} />
        ))}
      </g>
      {/* heart */}
      <g transform="translate(180 205)">
        <circle r="52" fill={`url(#${id}-body)`} />
        <path d="M0 22C-22 6-30-4-30-14a14 14 0 0 1 30-6 14 14 0 0 1 30 6c0 10-8 20-30 36Z" fill={BLUSH} />
      </g>
      {/* learners: a round avatar with a small speech tag */}
      {people.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <circle r="34" fill={`url(#${id}-body)`} />
          <circle cy="-8" r="12" fill={p.c} />
          <path d="M-20 22a20 16 0 0 1 40 0Z" fill={p.c} />
        </g>
      ))}
      <g transform="rotate(-6 150 60)">
        <rect x="104" y="40" width="96" height="38" rx="19" fill={`url(#${id}-body)`} />
        <text x="152" y="67" textAnchor="middle" fontSize="20" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          함께!
        </text>
      </g>
      <g transform="rotate(6 236 362)">
        <rect x="196" y="346" width="84" height="34" rx="17" fill={SAND} />
        <text x="238" y="369" textAnchor="middle" fontSize="18" fontWeight="800" fill={NAVY} fontFamily={KR_FONT}>
          화이팅
        </text>
      </g>
      <Sparkle x={320} y={210} s={1} />
      <Sparkle x={40} y={200} s={0.8} />
      <Sparkle x={250} y={50} s={0.7} />
    </svg>
  );
}

/** In slide order; slides past the fourth reuse them in turn. */
export const ONBOARDING_SCENES = [JourneyScene, StudyScene, ProgressScene, CommunityScene] as const;
