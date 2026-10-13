import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/homepage/homepage.module.css";
import { SitePage } from "@/components/site/SitePage";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.terms.metaTitle, alternates: localeAlternates("/terms", locale) };
}

const telegram = CONTACT.telegram ? CONTACT_LINKS.telegram(CONTACT.telegram) : null;

/** Public purchase terms, in the website's look (not the app shell). Text is editable in App Admin. */
export default async function TermsPage() {
  const { m } = await getMessages();
  const t = m.terms;

  return (
    <SitePage>
      <div className="mx-auto max-w-[760px] px-5 pt-16 pb-24 sm:px-6">
        <h1 className="m-0 text-[clamp(30px,6vw,44px)] leading-tight font-extrabold text-white">{t.title}</h1>
        <p className="mt-4 text-[#C9BEE3]">{t.intro}</p>
        <p className="mt-1 text-sm text-[#A99FC4]">{t.updated}</p>

        <div className="mt-10 flex flex-col gap-4">
          {t.sections.map((s, i) => (
            <section key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <h2 className="m-0 flex items-center gap-3 text-[19px] font-extrabold text-white">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#B79CFF]/20 text-sm text-[#B79CFF]">{i + 1}</span>
                {s.title}
              </h2>
              <p className="mt-3 mb-0 text-[16px] text-[#DCD3F0]">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold">
          {telegram && (
            <a href={telegram} target="_blank" rel="noopener noreferrer" className={`rounded-full px-6 py-3 text-white ${styles.glassPill}`}>
              {t.contactCta}
            </a>
          )}
          <Link href="/" className="rounded-full px-6 py-3 text-[#C9BEE3] hover:text-white">
            {t.back}
          </Link>
        </div>
      </div>
    </SitePage>
  );
}
