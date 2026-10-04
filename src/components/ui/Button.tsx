import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-field px-5 text-[15px] font-semibold transition " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet " +
  "disabled:cursor-not-allowed disabled:opacity-55";

// Claymorphism: an outer colored drop shadow for lift, inset highlight (top)
// and inset shade (bottom) for puffiness, and a pressed-in inset on :active.
const variants: Record<Variant, string> = {
  primary:
    "bg-violet text-white " +
    "shadow-[0_2px_4px_rgb(41_38_61_/_0.12),0_14px_24px_-10px_rgb(91_140_123_/_0.6),inset_0_2px_1px_rgb(255_255_255_/_0.35),inset_0_-3px_5px_rgb(0_0_0_/_0.18)] " +
    "hover:bg-violet-deep active:scale-[0.98] active:shadow-[inset_0_2px_6px_rgb(0_0_0_/_0.3)]",
  secondary:
    "border-2 border-teal bg-surface text-teal-deep " +
    "shadow-[0_6px_14px_-10px_rgb(41_38_61_/_0.25),inset_0_2px_1px_rgb(255_255_255_/_0.8),inset_0_-2px_3px_rgb(41_38_61_/_0.06)] " +
    "hover:bg-teal-mist active:scale-[0.98] active:shadow-[inset_0_2px_5px_rgb(41_38_61_/_0.15)]",
  ghost: "text-ink hover:underline",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

function Spinner() {
  return (
    <span
      className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="در حال انجام"
    />
  );
}
