import type { ReactNode } from "react";

/**
 * Opening band of a website inner page: kicker, title and subtitle, with the
 * page's own accent glow and a large Korean word behind the text, so each
 * page reads as its own place while sharing the site's look.
 */
export function SiteIntro({
  kicker,
  title,
  subtitle,
  ko,
  accent,
  children,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  ko: string;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative px-5 pt-14 pb-10 sm:px-6 sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-[-10%] size-[420px] rounded-full opacity-30 blur-[130px]" style={{ background: accent }} />
      <span
        lang="ko"
        aria-hidden="true"
        className="pointer-events-none absolute end-4 top-6 text-[clamp(84px,16vw,200px)] leading-none font-black select-none sm:end-10"
        style={{ color: accent, opacity: 0.12 }}
      >
        {ko}
      </span>
      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-3">
        <span className="text-[13px] font-extrabold tracking-wide" style={{ color: accent }}>
          {kicker}
        </span>
        <h1 className="m-0 max-w-[820px] text-[clamp(30px,5vw,52px)] leading-[1.3] font-black text-white">{title}</h1>
        {subtitle && <p className="m-0 max-w-[660px] text-[#C9BEE3]">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
