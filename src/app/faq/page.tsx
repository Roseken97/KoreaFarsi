import type { Metadata } from "next";
import { SiteCta } from "@/components/site/SiteCta";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getMessages } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return pageMetadata({ locale, path: "/faq", title: m.site.faq.metaTitle, description: m.site.faq.metaDescription });
}

const GROUP_COLORS = ["#2FE6E0", "#FF8FC7", "#FFC59A", "#B79CFF"];

/** FAQ: grouped questions as native <details> accordions, plus FAQPage structured data for Google. */
export default async function FaqPage() {
  const { m } = await getMessages();
  const t = m.site.faq;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.groups.flatMap((g) => g.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } }))),
  };

  return (
    <SitePage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="질문" accent="#B79CFF" />

      <div className="mx-auto flex max-w-[900px] flex-col gap-10 px-5 pb-16 sm:px-6">
        {t.groups.map((g, gi) => {
          const color = GROUP_COLORS[gi % GROUP_COLORS.length];
          return (
            <section key={g.title} className="flex flex-col gap-3">
              <h2 className="m-0 flex items-center gap-2.5 text-lg font-black text-white">
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                {g.title}
              </h2>
              {g.items.map((it) => (
                <details key={it.q} className="group rounded-[22px] border border-white/12 bg-white/[0.04] transition open:border-white/25 open:bg-white/[0.07]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-bold text-white [&::-webkit-details-marker]:hidden">
                    {it.q}
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                      style={{ color }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="m-0 px-5 pb-5 text-[15px] leading-[1.9] text-[#C9BEE3]">{it.a}</p>
                </details>
              ))}
            </section>
          );
        })}
      </div>

      <section className="mx-auto flex max-w-[900px] flex-col gap-4 px-5 pb-24 sm:px-6">
        <h2 className="m-0 text-xl font-black text-white">{t.stillTitle}</h2>
        <SiteCta links={[{ href: "/contact", label: t.stillCta }]} />
      </section>
    </SitePage>
  );
}
