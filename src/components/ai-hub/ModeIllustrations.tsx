import { useId } from "react";
import { BLUSH, CREAM, CREAM_SHADE, Defs, type IllustrationProps, KR_FONT, LAVENDER, MINT, NAVY, SAND, Sparkle } from "@/components/illustrations/kit";

/**
 * Soft-3D illustrations for the AI Hub cards, one per practice mode. Drawn in
 * cream and white with small accents from Rose's palette so they sit on any of
 * the five card colors. Shared pieces live in illustrations/kit.
 */
type Props = IllustrationProps;

/** Chat: two speech bubbles in conversation, a Korean greeting and a typing reply. */
export function ChatIllustration(props: Props) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 240" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="120" cy="120" r="100" fill={`url(#${id}-glow)`} />
      {/* back bubble (reply, typing) */}
      <g>
        <path d="M118 120h78a22 22 0 0 1 22 22v30a22 22 0 0 1-22 22h-8l4 18-24-18h-50a22 22 0 0 1-22-22v-30a22 22 0 0 1 22-22Z" fill={LAVENDER} />
        <path d="M118 120h78a22 22 0 0 1 22 22v6H96v-6a22 22 0 0 1 22-22Z" fill="#FFFFFF" opacity="0.35" />
        <circle cx="134" cy="158" r="7" fill={NAVY} opacity="0.85" />
        <circle cx="157" cy="158" r="7" fill={NAVY} opacity="0.6" />
        <circle cx="180" cy="158" r="7" fill={NAVY} opacity="0.35" />
      </g>
      {/* front bubble (greeting) */}
      <g>
        <path d="M46 44h104a26 26 0 0 1 26 26v34a26 26 0 0 1-26 26H84l-30 22 6-22h-14a26 26 0 0 1-26-26V70a26 26 0 0 1 26-26Z" fill={`url(#${id}-body)`} />
        <path d="M46 44h104a26 26 0 0 1 26 26v8H20v-8a26 26 0 0 1 26-26Z" fill={`url(#${id}-gloss)`} />
        <text x="98" y="99" textAnchor="middle" fontSize="34" fontWeight="700" fill={NAVY} fontFamily={KR_FONT}>
          안녕?
        </text>
      </g>
      <circle cx="196" cy="70" r="9" fill={BLUSH} />
      <circle cx="210" cy="96" r="5" fill={SAND} />
      <Sparkle x={38} y={176} s={1.1} />
      <Sparkle x={206} y={46} s={0.7} />
    </svg>
  );
}

/** Speak: a studio microphone with sound waves and a "말해요" (let's talk) tag. */
export function SpeakIllustration(props: Props) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 240" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="120" cy="110" r="100" fill={`url(#${id}-glow)`} />
      {/* sound waves */}
      <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
        <path d="M58 70a72 72 0 0 0 0 80" strokeWidth="8" opacity="0.85" />
        <path d="M36 54a100 100 0 0 0 0 112" strokeWidth="7" opacity="0.45" />
        <path d="M182 70a72 72 0 0 1 0 80" strokeWidth="8" opacity="0.85" />
        <path d="M204 54a100 100 0 0 1 0 112" strokeWidth="7" opacity="0.45" />
      </g>
      {/* stand */}
      <path d="M84 118v6a36 36 0 0 0 72 0v-6" stroke={CREAM} strokeWidth="9" strokeLinecap="round" />
      <rect x="114" y="158" width="12" height="34" rx="6" fill={CREAM_SHADE} />
      <rect x="86" y="188" width="68" height="16" rx="8" fill={`url(#${id}-body)`} />
      {/* capsule */}
      <rect x="92" y="36" width="56" height="108" rx="28" fill={`url(#${id}-body)`} />
      <rect x="92" y="36" width="56" height="50" rx="28" fill={`url(#${id}-gloss)`} />
      <g fill={NAVY} opacity="0.22">
        {[56, 70, 84, 98].map((y) => (
          <rect key={y} x="106" y={y} width="28" height="5" rx="2.5" />
        ))}
      </g>
      <rect x="92" y="108" width="56" height="10" fill={BLUSH} />
      <rect x="104" y="44" width="10" height="26" rx="5" fill="#FFFFFF" opacity="0.9" />
      {/* tag */}
      <g transform="rotate(8 186 30)">
        <rect x="149" y="14" width="74" height="32" rx="16" fill={SAND} />
        <text x="186" y="37" textAnchor="middle" fontSize="17" fontWeight="700" fill={NAVY} fontFamily={KR_FONT}>
          말해요
        </text>
      </g>
      <Sparkle x={46} y={190} s={0.9} />
      <Sparkle x={198} y={196} s={0.7} />
    </svg>
  );
}

/** Listen: headphones around a playing equalizer with drifting notes. */
export function ListenIllustration(props: Props) {
  const id = useId();
  const bars = [26, 46, 66, 42, 58, 30];
  return (
    <svg viewBox="0 0 240 240" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="120" cy="124" r="100" fill={`url(#${id}-glow)`} />
      {/* headband */}
      <path d="M48 140v-20a72 72 0 0 1 144 0v20" stroke={`url(#${id}-body)`} strokeWidth="16" strokeLinecap="round" />
      <path d="M58 112a62 62 0 0 1 124 0" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* equalizer */}
      <g>
        {bars.map((h, i) => (
          <rect key={i} x={84 + i * 13} y={164 - h} width="9" height={h} rx="4.5" fill={i % 2 ? SAND : "#FFFFFF"} />
        ))}
      </g>
      {/* ear cups */}
      {[30, 170].map((x) => (
        <g key={x}>
          <rect x={x} y="126" width="40" height="64" rx="20" fill={`url(#${id}-body)`} />
          <rect x={x} y="126" width="40" height="26" rx="13" fill={`url(#${id}-gloss)`} />
          <rect x={x === 30 ? x + 30 : x - 6} y="136" width="16" height="44" rx="8" fill={BLUSH} />
        </g>
      ))}
      {/* notes */}
      <g fill="#FFFFFF">
        <path d="M188 30v30.5a9 9 0 1 1-6-8.5V38l18-5v-6Z" />
        <path d="M44 46v22a7 7 0 1 1-5-6.7V46Z" opacity="0.8" />
      </g>
      <text x="120" y="214" textAnchor="middle" fontSize="18" fontWeight="700" fill="#FFFFFF" fontFamily={KR_FONT} opacity="0.9">
        들어 봐요
      </text>
      <Sparkle x={210} y={92} s={0.8} />
    </svg>
  );
}

/** Shadowing: a native voice wave and the learner's echo following it, with play and record buttons. */
export function ShadowIllustration(props: Props) {
  const id = useId();
  const wave = "M20 120c12 0 14-34 26-34s14 62 26 62 14-82 26-82 14 98 26 98 14-70 26-70 14 44 26 44 14-18 26-18 14 0 18 0";
  return (
    <svg viewBox="0 0 240 240" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="120" cy="120" r="100" fill={`url(#${id}-glow)`} />
      {/* panel */}
      <rect x="14" y="54" width="212" height="132" rx="30" fill="#FFFFFF" opacity="0.14" />
      {/* echo (learner) wave, offset */}
      <path d={wave} transform="translate(12 8)" stroke={MINT} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      {/* native wave */}
      <path d={wave} stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      {/* play (listen first) */}
      <g>
        <circle cx="70" cy="200" r="24" fill={`url(#${id}-body)`} />
        <path d="M63 188v24l20-12Z" fill={NAVY} />
      </g>
      {/* record (say it back) */}
      <g>
        <circle cx="170" cy="200" r="24" fill={`url(#${id}-body)`} />
        <circle cx="170" cy="200" r="10" fill={BLUSH} />
      </g>
      <path d="M100 200h40" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" />
      {/* tag */}
      <g transform="rotate(6 160 34)">
        <rect x="116" y="18" width="90" height="32" rx="16" fill={SAND} />
        <text x="161" y="41" textAnchor="middle" fontSize="17" fontWeight="700" fill={NAVY} fontFamily={KR_FONT}>
          따라 하기
        </text>
      </g>
      <Sparkle x={36} y={36} s={0.9} />
    </svg>
  );
}

/** Grammar: an open book with Hangul blocks snapping together (가 + ㄴ = 간). */
export function GrammarIllustration(props: Props) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 240" fill="none" direction="ltr" aria-hidden="true" {...props}>
      <Defs id={id} />
      <circle cx="120" cy="116" r="100" fill={`url(#${id}-glow)`} />
      {/* blocks */}
      <g>
        <rect x="26" y="40" width="58" height="58" rx="16" fill={`url(#${id}-body)`} transform="rotate(-8 55 69)" />
        <text x="55" y="82" textAnchor="middle" fontSize="32" fontWeight="700" fill={NAVY} fontFamily={KR_FONT} transform="rotate(-8 55 69)">
          가
        </text>
        <text x="100" y="78" textAnchor="middle" fontSize="26" fontWeight="700" fill="#FFFFFF">
          +
        </text>
        <rect x="118" y="46" width="46" height="46" rx="13" fill={SAND} transform="rotate(6 141 69)" />
        <text x="141" y="80" textAnchor="middle" fontSize="26" fontWeight="700" fill={NAVY} fontFamily={KR_FONT} transform="rotate(6 141 69)">
          ㄴ
        </text>
        <path d="M172 70h10m-6-7 7 7-7 7" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="186" y="38" width="44" height="64" rx="14" fill={BLUSH} />
        <text x="208" y="82" textAnchor="middle" fontSize="28" fontWeight="700" fill={NAVY} fontFamily={KR_FONT}>
          간
        </text>
      </g>
      {/* open book */}
      <g>
        <path d="M120 140c-24-14-56-18-92-14v74c36-4 68 0 92 14Z" fill={`url(#${id}-body)`} />
        <path d="M120 140c24-14 56-18 92-14v74c-36-4-68 0-92 14Z" fill={CREAM_SHADE} />
        <path d="M120 140c24-14 56-18 92-14v18c-36-4-68 0-92 14Z" fill="#FFFFFF" opacity="0.5" />
        <path d="M120 140v74" stroke={NAVY} strokeWidth="3" opacity="0.2" />
        <g stroke={NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.2">
          <path d="M44 150c20-2 40 0 60 6M44 166c20-2 40 0 60 6M44 182c20-2 40 0 48 4" />
          <path d="M136 156c20-6 40-8 60-6M136 172c20-6 40-8 60-6" />
        </g>
        <path d="M150 182c14-4 28-5 40-4" stroke={BLUSH} strokeWidth="6" strokeLinecap="round" />
      </g>
      <Sparkle x={34} y={120} s={0.8} />
      <Sparkle x={218} y={126} s={0.6} />
    </svg>
  );
}

export const MODE_ILLUSTRATIONS = {
  chat: ChatIllustration,
  speak: SpeakIllustration,
  listen: ListenIllustration,
  shadow: ShadowIllustration,
  grammar: GrammarIllustration,
} as const;
