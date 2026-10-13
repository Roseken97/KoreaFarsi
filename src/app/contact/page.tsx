import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { MailIcon, SendIcon, ShieldIcon } from "@/components/icons";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { SiteTicketForm } from "@/components/site/SiteTicketForm";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";
import { getCurrentUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.contact.metaTitle, description: m.site.contact.metaDescription, alternates: localeAlternates("/contact", locale) };
}

/** Contact us: Telegram and email cards, plus a support ticket form for signed-in visitors. */
export default async function ContactPage() {
  const [{ m }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  const t = m.site.contact;
  const menu = m.homepage.menu;

  const channels: { key: string; title: string; body: string; action: string; href: string; handle: string; color: string; icon: ReactNode }[] = [];
  if (CONTACT.telegram)
    channels.push({ key: "telegram", ...t.telegram, href: CONTACT_LINKS.telegram(CONTACT.telegram), handle: `@${CONTACT.telegram}`, color: "#2FE6E0", icon: <SendIcon width={22} height={22} /> });
  if (CONTACT.email)
    channels.push({ key: "email", ...t.email, href: CONTACT_LINKS.email(CONTACT.email), handle: CONTACT.email, color: "#FF8FC7", icon: <MailIcon width={22} height={22} /> });

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={t.title} subtitle={t.subtitle} ko="문의" accent="#2FE6E0" />

      <div className="mx-auto grid max-w-[1200px] gap-5 px-5 pb-24 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-4">
          {channels.map((c) => (
            <a
              key={c.key}
              href={c.href}
              target={c.key === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-[26px] border border-white/12 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${c.color}24`, color: c.color, boxShadow: `inset 0 0 0 1px ${c.color}55` }}>
                {c.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <strong className="text-white">{c.title}</strong>
                <span className="text-sm text-[#C9BEE3]">{c.body}</span>
                <span dir="ltr" className="truncate text-sm font-bold rtl:text-end" style={{ color: c.color }}>
                  {c.handle}
                </span>
              </span>
              <span className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white group-hover:bg-white/[0.08] sm:inline">{c.action}</span>
            </a>
          ))}
        </div>

        <section id="ticket" className="scroll-mt-6 rounded-[28px] border border-white/15 p-6 sm:p-8" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(47,230,224,0.08) 100%)" }}>
          <div className="mb-5 flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#B79CFF]/20 text-[#B79CFF] shadow-[inset_0_0_0_1px_#B79CFF55]">
              <ShieldIcon width={22} height={22} />
            </span>
            <div className="flex flex-col">
              <h2 className="m-0 text-xl font-black text-white">{t.ticket.title}</h2>
              <p className="m-0 text-sm text-[#C9BEE3]">{t.ticket.body}</p>
            </div>
          </div>
          {user ? (
            <>
              <SiteTicketForm />
              <Link href="/account/help/tickets" className="mt-5 inline-block text-sm font-bold text-[#6FF3EE] hover:underline">
                {t.ticket.myTickets}
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="m-0 text-[15px] text-white">{t.ticket.loginPrompt}</p>
              <div className="flex flex-wrap gap-3 text-sm font-bold">
                <Link href="/auth/login?next=/contact" className="rounded-full bg-white/90 px-6 py-2.5 font-extrabold text-[#1C1336]">
                  {menu.login}
                </Link>
                <Link href="/auth/signup?next=/contact" className="rounded-full border border-white/20 px-6 py-2.5 text-white hover:bg-white/[0.08]">
                  {menu.signup}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </SitePage>
  );
}
