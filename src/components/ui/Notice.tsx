import type { ReactNode } from "react";

const tones = {
  error: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
  info: "bg-sage-soft text-teal-deep",
} as const;

export function Notice({ tone = "info", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-field px-4 py-3 text-sm leading-6 ${tones[tone]}`}>
      {children}
    </div>
  );
}
