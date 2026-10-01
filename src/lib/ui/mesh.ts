/**
 * Shared "polished colorful" mesh-gradient backgrounds: a base color-to-deep
 * linear gradient plus two tinted radial blobs from neighboring palette
 * hues, instead of one flat fill. Pair with the `.card-grain` class (in
 * globals.css) for the matte texture. Kept to the four vivid identity
 * colors that have a `-deep` partner (violet/coral/teal/yellow) — pale
 * category tones (sage, blush-soft, cream-deep, ...) stay flat.
 */
export const MESH = {
  violet:
    "radial-gradient(120% 100% at 0% 0%, rgb(232 90 159 / 0.35), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(93 143 232 / 0.3), transparent 60%), linear-gradient(135deg, var(--color-violet), var(--color-violet-deep))",
  coral:
    "radial-gradient(120% 100% at 0% 0%, rgb(255 183 43 / 0.35), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(232 90 159 / 0.3), transparent 60%), linear-gradient(135deg, var(--color-coral), var(--color-coral-deep))",
  teal: "radial-gradient(120% 100% at 0% 0%, rgb(93 143 232 / 0.35), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(123 67 214 / 0.3), transparent 60%), linear-gradient(135deg, var(--color-teal), var(--color-teal-deep))",
  yellow:
    "radial-gradient(120% 100% at 0% 0%, rgb(244 106 69 / 0.3), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(232 90 159 / 0.25), transparent 60%), linear-gradient(135deg, var(--color-yellow), var(--color-yellow-deep))",
} as const;

export type MeshColor = keyof typeof MESH;

/** Matching restrained, realistic (not neon-glow) shadow for a mesh card. */
export const MESH_SHADOW: Record<MeshColor, string> = {
  violet: "shadow-[0_2px_6px_rgb(41_38_61_/_0.08),0_14px_26px_-12px_rgb(123_67_214_/_0.4)]",
  coral: "shadow-[0_2px_6px_rgb(41_38_61_/_0.08),0_14px_26px_-12px_rgb(244_106_69_/_0.4)]",
  teal: "shadow-[0_2px_6px_rgb(41_38_61_/_0.08),0_14px_26px_-12px_rgb(32_184_176_/_0.4)]",
  yellow: "shadow-[0_2px_6px_rgb(41_38_61_/_0.08),0_14px_26px_-12px_rgb(255_183_43_/_0.4)]",
};
