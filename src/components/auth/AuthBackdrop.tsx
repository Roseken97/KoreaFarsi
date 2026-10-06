/**
 * Frosted backdrop for the sign-in screens, after the soft-3D reference: white with soft
 * blurred glows from Rose's palette (lavender, blush, mint, periwinkle). Purely decorative;
 * it fills its parent.
 */
export function AuthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white" aria-hidden="true">
      <span className="absolute -end-24 -top-24 size-72 rounded-full bg-[#d1b6e7] opacity-45 blur-3xl" />
      <span className="absolute -start-28 top-1/3 size-64 rounded-full bg-[#cbf2e8] opacity-50 blur-3xl" />
      <span className="absolute -bottom-24 -start-16 size-80 rounded-full bg-[#f5d6de] opacity-60 blur-3xl" />
      <span className="absolute -end-20 bottom-10 size-56 rounded-full bg-[#a4b6f3] opacity-35 blur-3xl" />
    </div>
  );
}
