import type { ComponentType, ReactNode, SVGProps } from "react";
import { ChevronIcon } from "@/components/icons";
import { MotionCard } from "@/components/motion/MotionCard";

type RowProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body?: string;
  badge?: string;
  tone?: string;
  /** Let the description wrap instead of truncating (for informational rows). */
  wrap?: boolean;
};

export function RowContent({ Icon, title, body, badge, tone = "bg-cream-deep text-ink", wrap = false }: RowProps) {
  return (
    <>
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon width={20} height={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-medium text-ink">{title}</span>
          {badge && (
            <span className="rounded-full bg-blush-soft px-2 py-0.5 text-[10px] font-semibold text-ink-soft">{badge}</span>
          )}
        </span>
        {body && <span className={`mt-0.5 block text-[13px] text-ink-soft ${wrap ? "leading-5" : "truncate"}`}>{body}</span>}
      </span>
    </>
  );
}

const rowClass = "flex w-full items-center gap-3 px-4 py-3.5 text-start transition hover:bg-cream/70";

/** Account-style list row: icon + title + description + chevron. */
export function ListRow({ href, ...props }: RowProps & { href: string }) {
  return (
    <li>
      <MotionCard href={href} tilt={false} className={rowClass}>
        <RowContent {...props} />
        <ChevronIcon width={18} height={18} className="text-ink-faint" />
      </MotionCard>
    </li>
  );
}

export function ListGroup({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-line/70 overflow-hidden rounded-card bg-surface shadow-soft">{children}</ul>;
}

export { rowClass };
