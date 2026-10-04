/**
 * Shared "polished colorful" mesh-gradient backgrounds: a base color-to-deep
 * linear gradient plus two tinted radial blobs from neighboring palette
 * hues, instead of one flat fill. Pair with the `.card-grain` class (in
 * globals.css) for the matte texture.
 *
 * violet/clay/indigo/gold are the harmonized identity family — analogous,
 * muted, Korean-pigment-inspired tones built around the celadon signature
 * (violet). Each one's tint blobs borrow from its two neighbors in that
 * family, so the four read as one cohesive palette rather than four
 * competing hues. coral/teal/yellow/sky are kept for their other uses
 * elsewhere (secondary button, success, bottom-nav accent, ...) but are no
 * longer used as identity/category colors.
 */
export const MESH = {
  violet:
    "radial-gradient(120% 100% at 0% 0%, rgb(201 154 62 / 0.3), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(74 107 138 / 0.3), transparent 60%), linear-gradient(135deg, var(--color-violet), var(--color-violet-deep))",
  clay: "radial-gradient(120% 100% at 0% 0%, rgb(201 154 62 / 0.35), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(91 140 123 / 0.3), transparent 60%), linear-gradient(135deg, var(--color-clay), var(--color-clay-deep))",
  indigo:
    "radial-gradient(120% 100% at 0% 0%, rgb(91 140 123 / 0.3), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(193 122 84 / 0.25), transparent 60%), linear-gradient(135deg, var(--color-indigo), var(--color-indigo-deep))",
  gold: "radial-gradient(120% 100% at 0% 0%, rgb(193 122 84 / 0.3), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(91 140 123 / 0.25), transparent 60%), linear-gradient(135deg, var(--color-gold), var(--color-gold-deep))",
} as const;

export type MeshColor = keyof typeof MESH;

/**
 * Neumorphism: a diagonal dark/light shadow pair — the dark side tinted with
 * the card's own hue instead of plain ink, the light side white — so the
 * card reads as gently raised off the page rather than flat with a shadow
 * under it.
 */
export const MESH_SHADOW: Record<MeshColor, string> = {
  violet: "shadow-[8px_8px_20px_rgb(91_140_123_/_0.35),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  clay: "shadow-[8px_8px_20px_rgb(193_122_84_/_0.35),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  indigo: "shadow-[8px_8px_20px_rgb(74_107_138_/_0.35),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  gold: "shadow-[8px_8px_20px_rgb(201_154_62_/_0.35),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
};
