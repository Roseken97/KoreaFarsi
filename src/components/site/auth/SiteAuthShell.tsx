import type { ReactNode } from "react";
import { CheckIcon } from "@/components/icons";

/**
 * Website auth layout: a short intro with the account perks beside a glass form card.
 * Lives inside SitePage, so the site header, footer and page transition stay.
 */
export function SiteAuthShell({ kicker, title, subtitle, perks, ko, children }: { kicker: string; title: string; subtitle: string; perks: string[]; ko: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto grid max-w-[1100px] items-start gap-10 px-5 pt-12 pb-24 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 start-0 size-[380px] rounded-full bg-[#8B5CF6] opacity-25 blur-[130px]" />
      <div className="relative flex flex-col gap-4 lg:pt-6">
        <span lang="ko" aria-hidden="true" className="text-[64px] leading-none font-black text-[#B79CFF]/20">
          {ko}
        </span>
        <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{kicker}</span>
        <h1 className="m-0 text-[clamp(30px,4.4vw,46px)] leading-[1.3] font-black text-white">{title}</h1>
        <p className="m-0 max-w-[460px] text-[#C9BEE3]">{subtitle}</p>
        <ul className="m-0 mt-2 hidden list-none flex-col gap-2.5 p-0 lg:flex">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[15px] text-white">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2FE6E0]/15 text-[#2FE6E0]">
                <CheckIcon width={15} height={15} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative rounded-[30px] border border-white/15 bg-white/[0.05] p-6 shadow-[0_40px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">{children}</div>
    </div>
  );
}
