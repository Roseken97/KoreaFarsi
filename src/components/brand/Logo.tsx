/**
 * PROVISIONAL wordmark. Replace with Rose's logo files
 * (drop them in /public/brand and swap this component's markup).
 */
export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-[30%] bg-teal text-cream shadow-soft"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="font-bold leading-none" style={{ fontSize: size * 0.42 }} lang="ko">
        한
      </span>
    </span>
  );
}

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      {withText && (
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-ink">کره‌فارسی</span>
          <span className="text-xs font-medium tracking-wide text-ink-soft" dir="ltr">
            KoreaFarsi
          </span>
        </span>
      )}
    </span>
  );
}
