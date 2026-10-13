import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCover } from "@/components/bookstore/ProductCover";
import { ChatBubbleIcon, PlannerIcon, SettingsIcon, SparkleIcon } from "@/components/icons";
import { SiteNameForm, SitePasswordForm } from "@/components/site/auth/SiteAccountForms";
import { SiteSignOut } from "@/components/site/auth/SiteSignOut";
import { SitePage } from "@/components/site/SitePage";
import { isAdminEmail } from "@/lib/admin";
import { titles } from "@/lib/bookstore/types";
import { fmt } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { getMyLibrary } from "@/lib/library/queries";
import { getProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getMyTickets } from "@/lib/tickets/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.site.account.metaTitle, robots: { index: false } };
}

const STATUS_COLOR = { open: "#FF8FC7", answered: "#2FE6E0", closed: "#A99FC4" } as const;

/**
 * The website's own account page, separate from the app's /account: purchases, tickets,
 * name and password, links into the app, and the admin panel for admins.
 */
export default async function MyAccountPage() {
  const [{ m, locale }, profile] = await Promise.all([getMessages(), getProfile()]);
  if (isSupabaseConfigured && !profile) redirect("/login?next=/my-account");
  const [library, tickets] = await Promise.all([getMyLibrary(), getMyTickets()]);
  const t = m.site.account;
  const tk = m.account.helpPage.tickets;

  const quick = [
    { href: "/home", label: t.links.app, icon: <SparkleIcon width={20} height={20} />, color: "#5D8FE8" },
    { href: "/planner", label: t.links.planner, icon: <PlannerIcon width={20} height={20} />, color: "#FFB72B" },
  ];
  const isAdmin = isAdminEmail(profile?.user.email);

  return (
    <SitePage>
      <div className="relative mx-auto flex max-w-[1100px] flex-col gap-12 px-5 pt-12 pb-24 sm:px-6 sm:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 end-0 size-[380px] rounded-full bg-[#2FE6E0] opacity-15 blur-[130px]" />

        <header className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.kicker}</span>
            <h1 className="m-0 text-[clamp(30px,4.6vw,48px)] leading-tight font-black text-white">{profile?.name ? fmt(t.hello, { name: profile.name }) : t.helloFallback}</h1>
            {profile?.user.email && (
              <span dir="ltr" className="text-sm text-[#A99FC4] rtl:text-end">
                {profile.user.email}
              </span>
            )}
          </div>
          {profile && <SiteSignOut label={t.signOut} />}
        </header>

        {isAdmin && (
          <Link
            href="/admin"
            className="relative flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[#FFB72B]/40 bg-[#FFB72B]/[0.08] p-6 transition hover:border-[#FFB72B]/70"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#FFB72B]/20 text-[#FFB72B]">
                <SettingsIcon width={22} height={22} />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-black text-white">{t.adminTitle}</span>
                <span className="text-sm text-[#E4DAF7]">{t.adminBody}</span>
              </span>
            </span>
            <span className="rounded-full bg-[#FFB72B] px-5 py-2.5 text-sm font-extrabold text-[#1C1336]">{t.adminCta}</span>
          </Link>
        )}

        <section className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-xl font-black text-white">{t.library}</h2>
            {library.length > 0 && (
              <Link href="/library" className="text-sm font-bold text-[#6FF3EE] hover:underline">
                {t.openInApp}
              </Link>
            )}
          </div>
          {library.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-white/12 bg-white/[0.04] p-6">
              <p className="m-0 text-[#C9BEE3]">{t.libraryEmpty}</p>
              <Link href="/shop" className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-extrabold text-[#1C1336] hover:bg-white">
                {t.browse}
              </Link>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-5">
              {library.map((entry) => (
                <li key={entry.id}>
                  <Link href="/library" className="flex flex-col gap-2 rounded-[22px] border border-white/10 bg-white/[0.04] p-3 transition hover:border-white/25">
                    <ProductCover product={entry.product} sizes="200px" />
                    <span className="line-clamp-2 text-sm font-bold text-white" dir="auto">
                      {titles(entry.product, locale).primary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="m-0 text-xl font-black text-white">{t.tickets}</h2>
              <Link href="/contact#ticket" className="text-sm font-bold text-[#6FF3EE] hover:underline">
                {t.newTicket}
              </Link>
            </div>
            {tickets.length === 0 ? (
              <p className="m-0 rounded-[26px] border border-white/12 bg-white/[0.04] p-6 text-[#C9BEE3]">{t.ticketsEmpty}</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <Link href={`/account/help/tickets/${ticket.id}`} className="flex items-center gap-3 rounded-[20px] border border-white/12 bg-white/[0.04] p-4 transition hover:border-white/25">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#B79CFF]/15 text-[#B79CFF]">
                        <ChatBubbleIcon width={18} height={18} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-bold text-white" dir="auto">
                          {ticket.subject}
                        </span>
                        <span className="text-xs text-[#A99FC4]">{tk.categories[ticket.category]}</span>
                      </span>
                      <span className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold" style={{ color: STATUS_COLOR[ticket.status], background: `${STATUS_COLOR[ticket.status]}1F` }}>
                        {tk.status[ticket.status]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-xl font-black text-white">{t.quick}</h2>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
              {quick.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="flex h-full flex-col gap-3 rounded-[22px] border border-white/12 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.07]">
                    <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${q.color}24`, color: q.color, boxShadow: `inset 0 0 0 1px ${q.color}55` }}>
                      {q.icon}
                    </span>
                    <span className="text-[15px] font-bold text-white">{q.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {profile && (
          <section className="relative flex flex-col gap-4">
            <h2 className="m-0 text-xl font-black text-white">{t.settingsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <SiteNameForm userId={profile.user.id} initialName={profile.name ?? ""} email={profile.user.email ?? ""} />
              <SitePasswordForm />
            </div>
          </section>
        )}
      </div>
    </SitePage>
  );
}
