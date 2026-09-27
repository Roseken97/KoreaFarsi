import Image from "next/image";

/** Official KoreaFarsi mark (public/brand/logo-512.png, transparent). */
export function LogoMark({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/logo-512.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className="shrink-0 select-none"
      draggable={false}
    />
  );
}

/** Mark + "KoreaFarsi" serif wordmark. The wordmark is the brand name, so it stays Latin in every locale. */
export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" dir="ltr">
      <LogoMark size={size} />
      {withText && (
        <span className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-tight text-ink">
          KoreaFarsi
        </span>
      )}
    </span>
  );
}
