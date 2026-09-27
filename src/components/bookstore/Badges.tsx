import type { ReactNode } from "react";

const tones = {
  sample: "bg-surface/90 text-ink-soft border border-line",
  soon: "bg-ink text-cream",
  discount: "bg-blush text-white",
  format: "bg-cream-deep text-ink-soft",
} as const;

export function Badge({ tone, children }: { tone: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}
