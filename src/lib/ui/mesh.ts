/**
 * Shared "polished colorful" mesh-gradient backgrounds: a base color-to-deeper
 * linear gradient plus two tinted radial blobs from neighboring palette
 * hues, instead of one flat fill. Pair with the `.card-grain` class (in
 * globals.css) for the matte texture.
 *
 * Colors are Rose's NEXTPURE palette, lifted to read livelier on a white
 * page: periwinkle (violet, courses), rose (clay, bookstore), lavender
 * (indigo, AI Hub), sand (gold, planner) and mint (Korea Life). They are
 * light, so text on these cards is navy (`text-ink`), never white. Tint
 * blobs come from the palette's own tints (#F5D6DE #D1B6E7 #CBF2E8 #D4C9E1).
 */
export const MESH = {
  violet:
    "radial-gradient(120% 100% at 0% 0%, rgb(209 182 231 / 0.55), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(203 242 232 / 0.35), transparent 60%), linear-gradient(135deg, #a4b6f3, #7690ea)",
  clay: "radial-gradient(120% 100% at 0% 0%, rgb(248 212 166 / 0.5), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(209 182 231 / 0.4), transparent 60%), linear-gradient(135deg, #fbc6c3, #f8a8a8)",
  indigo:
    "radial-gradient(120% 100% at 0% 0%, rgb(245 214 222 / 0.55), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(118 144 234 / 0.3), transparent 60%), linear-gradient(135deg, #d1b6e7, #ae8ad2)",
  gold: "radial-gradient(120% 100% at 0% 0%, rgb(245 214 222 / 0.55), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(203 242 232 / 0.4), transparent 60%), linear-gradient(135deg, #fbe4c6, #f8d4a6)",
  mint: "radial-gradient(120% 100% at 0% 0%, rgb(212 201 225 / 0.5), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgb(118 144 234 / 0.2), transparent 60%), linear-gradient(135deg, #cbf2e8, #aaeedd)",
} as const;

export type MeshColor = keyof typeof MESH;

/**
 * Neumorphism: a diagonal dark/light shadow pair — the dark side tinted with
 * the card's own hue instead of plain ink, the light side white — so the
 * card reads as gently raised off the page rather than flat with a shadow
 * under it.
 */
export const MESH_SHADOW: Record<MeshColor, string> = {
  violet: "shadow-[8px_8px_20px_rgb(118_144_234_/_0.4),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  clay: "shadow-[8px_8px_20px_rgb(233_138_143_/_0.4),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  indigo: "shadow-[8px_8px_20px_rgb(174_138_210_/_0.4),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  gold: "shadow-[8px_8px_20px_rgb(214_168_110_/_0.4),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
  mint: "shadow-[8px_8px_20px_rgb(110_196_172_/_0.4),-6px_-6px_16px_rgb(255_255_255_/_0.7)]",
};
