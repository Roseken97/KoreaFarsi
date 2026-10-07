import type { SVGProps } from "react";

/**
 * Shared pieces for the app's soft-3D SVG illustrations (AI Hub modes, Home
 * cards, onboarding): cream and white bodies lit from the top, small accents
 * from Rose's palette, navy only for small details. Every illustration passes
 * its own useId() to <Defs> so several can render on one page.
 */
export type IllustrationProps = SVGProps<SVGSVGElement>;

export const NAVY = "#1E2340";
export const CREAM = "#FFFDF6";
export const CREAM_SHADE = "#EDE6DA";
export const BLUSH = "#F5B8C4";
export const SAND = "#F8D4A6";
export const MINT = "#AAEEDD";
export const LAVENDER = "#D1B6E7";
export const PERIWINKLE = "#A4B6F3";
export const KR_FONT = "'Apple SD Gothic Neo','Noto Sans KR',sans-serif";

/** `${id}-body` top-lit cream fill, `${id}-gloss` white highlight, `${id}-glow` soft halo. */
export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.55" stopColor={CREAM} />
        <stop offset="1" stopColor={CREAM_SHADE} />
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function Sparkle({ x, y, s = 1, fill = "#FFFFFF" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -10C1.2 -3.5 3.5 -1.2 10 0C3.5 1.2 1.2 3.5 0 10C-1.2 3.5 -3.5 1.2 -10 0C-3.5 -1.2 -1.2 -3.5 0 -10Z"
      fill={fill}
    />
  );
}
