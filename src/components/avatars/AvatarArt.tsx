import type { ReactNode } from "react";
import type { AvatarKey } from "@/lib/avatars";

/** One 5-petal blossom, built from a single petal shape rotated around its own center. */
function BlossomFlower({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  const petalAngles = [0, 72, 144, 216, 288];
  return (
    <g>
      {petalAngles.map((angle) => (
        <ellipse
          key={angle}
          cx={cx}
          cy={cy - 4.6 * scale}
          rx={2.9 * scale}
          ry={4.8 * scale}
          fill="var(--color-blush)"
          stroke="var(--color-blush-soft)"
          strokeWidth={0.4}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={1.6 * scale} fill="var(--color-gold)" />
    </g>
  );
}

/** A single 4-point sparkle/star shape, centered at (cx, cy). */
function Sparkle({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const d = `M ${cx} ${cy - r} C ${cx + r * 0.18} ${cy - r * 0.18} ${cx + r * 0.82} ${cy - r * 0.18} ${cx + r} ${cy}
    C ${cx + r * 0.18} ${cy + r * 0.18} ${cx + r * 0.18} ${cy + r * 0.82} ${cx} ${cy + r}
    C ${cx - r * 0.18} ${cy + r * 0.18} ${cx - r * 0.82} ${cy + r * 0.18} ${cx - r} ${cy}
    C ${cx - r * 0.18} ${cy - r * 0.18} ${cx - r * 0.18} ${cy - r * 0.82} ${cx} ${cy - r} Z`;
  return <path d={d} fill={fill} />;
}

/**
 * Illustrated badge art for each preset avatar (replaces the old single-glyph
 * circle). Each is a self-contained 64x64 scene built only from the app's own
 * color tokens, so new avatars stay on-brand automatically.
 */
const AVATAR_ART: Record<AvatarKey, () => ReactNode> = {
  star: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-indigo-soft)" />
      <Sparkle cx={32} cy={32} r={15} fill="var(--color-indigo-deep)" />
      <Sparkle cx={47} cy={19} r={5} fill="var(--color-gold)" />
      <Sparkle cx={17} cy={46} r={4} fill="var(--color-gold)" />
    </>
  ),
  blossom: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-blush-soft)" />
      <path
        d="M14 48c6-8 10-10 14-16s4-12 10-18"
        fill="none"
        stroke="var(--color-clay-deep)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <BlossomFlower cx={22} cy={40} scale={1.05} />
      <BlossomFlower cx={33} cy={27} scale={0.9} />
      <BlossomFlower cx={42} cy={16} scale={0.75} />
    </>
  ),
  moon: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-indigo-deep)" />
      {/* Crescent via circle subtraction: a solid moon disc, then an offset bg-colored circle cuts the sliver. */}
      <circle cx={29} cy={32} r={14} fill="var(--color-gold-soft)" />
      <circle cx={36} cy={27} r={13} fill="var(--color-indigo-deep)" />
      <Sparkle cx={47} cy={18} r={2.6} fill="var(--color-gold)" />
      <Sparkle cx={16} cy={44} r={1.8} fill="var(--color-gold)" />
    </>
  ),
  sun: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-gold-soft)" />
      <g stroke="var(--color-gold-deep)" strokeWidth={2.4} strokeLinecap="round">
        <path d="M32 8v5M32 51v5M8 32h5M51 32h5M14.9 14.9l3.5 3.5M45.6 45.6l3.5 3.5M14.9 49.1l3.5-3.5M45.6 18.4l3.5-3.5" />
      </g>
      <circle cx={32} cy={32} r={11} fill="var(--color-gold)" />
      <path d="M8 50c6-6 12-9 24-9s18 3 24 9v6H8z" fill="var(--color-clay-deep)" opacity={0.18} />
    </>
  ),
  forest: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-sage-soft)" />
      <path d="M18 46 27 24l9 22Z" fill="var(--color-violet-deep)" opacity={0.85} />
      <path d="M34 46 44 20l10 26Z" fill="var(--color-teal-deep)" />
      <path d="M12 46 20 30l8 16Z" fill="var(--color-violet)" opacity={0.8} />
      <rect x={10} y={46} width={44} height={4} rx={2} fill="var(--color-teal-deep)" opacity={0.3} />
    </>
  ),
  river: () => (
    <>
      <circle cx={32} cy={32} r={32} fill="var(--color-sky-soft)" />
      <path
        d="M4 24c7-5 11 5 18 0s11-5 18 0 11 5 18 0"
        fill="none"
        stroke="var(--color-sky)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d="M4 36c7-5 11 5 18 0s11-5 18 0 11 5 18 0"
        fill="none"
        stroke="var(--color-teal)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d="M4 48c7-5 11 5 18 0s11-5 18 0 11 5 18 0"
        fill="none"
        stroke="var(--color-sky-deep)"
        strokeWidth={3.2}
        strokeLinecap="round"
        opacity={0.6}
      />
    </>
  ),
};

export function AvatarArt({ avatarKey, size }: { avatarKey: AvatarKey; size: number }) {
  const Art = AVATAR_ART[avatarKey];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <Art />
    </svg>
  );
}
