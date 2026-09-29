"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import {
  HomeIcon,
  HelpIcon,
  BooksStackIcon,
  LibraryIcon,
  SparkleIcon,
  ChatBubbleIcon,
  GlobeIcon,
  InstagramIcon,
  YouTubeIcon,
  SendIcon,
} from "@/components/icons";
import { Magnetic } from "@/components/marketing/Magnetic";
import { InstallAppButton } from "@/components/marketing/InstallAppButton";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import type { Messages } from "@/lib/i18n/config";

const SECTIONS = ["home", "about", "courses", "books", "features", "contact"] as const;
type Section = (typeof SECTIONS)[number];

const NAV_ICONS: Record<Section, ComponentType<{ width?: number; height?: number }>> = {
  home: HomeIcon,
  about: HelpIcon,
  courses: BooksStackIcon,
  books: LibraryIcon,
  features: SparkleIcon,
  contact: ChatBubbleIcon,
};

const CONTACT_ICONS = { website: GlobeIcon, instagram: InstagramIcon, youtube: YouTubeIcon, telegram: SendIcon } as const;
type SocialChannel = keyof typeof CONTACT_ICONS;

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#b57edc]/20 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-[#b57edc]/40 hover:bg-[#b57edc]/10">
      <h3 className="mb-2 text-base font-semibold text-[#e0c8ff]">{title}</h3>
      <p className="text-sm leading-6 text-[#a8a0b0]">{body}</p>
    </div>
  );
}

/**
 * Dark, single-viewport, sidebar-tab layout (Rose's reference), fully replacing the scrolling
 * light-theme landing page. No page scroll — the icon sidebar switches which panel is visible,
 * each panel scrolling internally if its own content runs long.
 */
export function DarkLandingApp({ m, siteDomain }: { m: Messages; siteDomain: string }) {
  const [active, setActive] = useState<Section>("home");
  const t = m.marketing;
  const socials = (Object.keys(CONTACT_ICONS) as SocialChannel[]).filter((k) => CONTACT[k]);

  const navLabels: Record<Section, string> = {
    home: m.nav.home,
    about: t.method.eyebrow,
    courses: t.features.items.courses.title,
    books: t.features.items.bookstore.title,
    features: t.nav.features,
    contact: t.nav.contact,
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#2a2a3e] font-sans text-[#e0e0e0]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-16 shrink-0 flex-col items-center gap-3 overflow-y-auto border-e border-white/5 bg-[#1f1f2e] py-5 sm:w-20">
          <button
            type="button"
            onClick={() => setActive("home")}
            className="mb-3 grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#b57edc] to-[#8b7dcf] text-base font-semibold text-white transition hover:scale-105 hover:shadow-[0_8px_16px_rgba(181,126,220,0.3)] sm:size-[50px]"
          >
            KF
          </button>
          {SECTIONS.map((s) => {
            const Icon = NAV_ICONS[s];
            const isActive = active === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setActive(s)}
                title={navLabels[s]}
                className={`relative grid size-11 shrink-0 place-items-center rounded-xl transition sm:size-[50px] ${
                  isActive ? "bg-[#b57edc]/25 text-[#e0c8ff]" : "text-[#a0a0b0] hover:bg-[#b57edc]/15 hover:text-[#c9a8e0]"
                }`}
              >
                {isActive && (
                  <span className="absolute -start-3 h-[30px] w-[3px] rounded bg-gradient-to-b from-[#b57edc] to-[#8b7dcf]" />
                )}
                <Icon width={20} height={20} />
              </button>
            );
          })}
          <div className="mt-auto">
            <LanguageSwitch />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {active === "home" && (
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-14 text-center sm:px-10">
              <h1 className="mb-4 bg-gradient-to-br from-[#f5e6d3] to-[#e0c8ff] bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl">
                KoreaFarsi
              </h1>
              <p className="mb-8 max-w-xl text-base leading-7 text-[#c9a8e0] sm:text-lg">{t.hero.subtitle}</p>
              <Magnetic>
                <Link
                  href="/auth/welcome"
                  className="inline-flex rounded-lg bg-gradient-to-br from-[#b57edc] to-[#8b7dcf] px-8 py-3 text-[15px] font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(181,126,220,0.3)]"
                >
                  {t.hero.cta}
                </Link>
              </Magnetic>
              <Link href="/auth/login" className="mt-4 text-sm text-[#a0a0b0] hover:text-[#c9a8e0]">
                {t.hero.pills.login}
              </Link>
            </div>
          )}

          {active === "about" && (
            <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
              <span className="rounded-full bg-[#b57edc]/15 px-3 py-1 text-xs font-semibold text-[#e0c8ff]">
                {t.method.eyebrow}
              </span>
              <h2 className="mt-4 mb-4 text-2xl font-semibold text-[#f5e6d3] sm:text-3xl">{t.method.title}</h2>
              <p className="text-base leading-8 text-[#b8a8c0]">{t.method.intro}</p>
            </div>
          )}

          {active === "courses" && (
            <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
              <h2 className="mb-2 text-2xl font-semibold text-[#f5e6d3] sm:text-3xl">{t.features.items.courses.title}</h2>
              <p className="mb-6 text-base text-[#b8a8c0]">{t.features.items.courses.body}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {t.method.steps.slice(0, 4).map((step, i) => (
                  <Card key={step} title={step} body={t.method.stepDetails[i]} />
                ))}
              </div>
              <Link
                href="/courses"
                className="mt-8 inline-flex rounded-lg bg-gradient-to-br from-[#b57edc] to-[#8b7dcf] px-6 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                {t.hero.pills.courses}
              </Link>
            </div>
          )}

          {active === "books" && (
            <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
              <h2 className="mb-2 text-2xl font-semibold text-[#f5e6d3] sm:text-3xl">{t.features.items.bookstore.title}</h2>
              <p className="mb-6 text-base text-[#b8a8c0]">{t.features.items.bookstore.body}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card title="کتاب الفبای کره‌ای" body="تاریخچهٔ هنگول، پادشاه سجونگ، حروف صدادار و بی‌صدا، و تمرین‌های ساختاریافته." />
                <Card title="کتاب‌های درسی یکپارچه" body="چهار مهارت گفتاری، شنیداری، خواندن و نوشتاری در یک مسیر واحد." />
                <Card title="منابع مرجع" body="راهنمای جامع گرامر و واژگان برای مرور سریع." />
                <Card title="کتاب کار تمرین" body="تمرین‌های کاربردی و واقعی برای تثبیت هر درس." />
              </div>
              <Link
                href="/bookstore"
                className="mt-8 inline-flex rounded-lg bg-gradient-to-br from-[#b57edc] to-[#8b7dcf] px-6 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                {navLabels.books}
              </Link>
            </div>
          )}

          {active === "features" && (
            <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
              <h2 className="mb-6 text-2xl font-semibold text-[#f5e6d3] sm:text-3xl">{t.features.title}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card title={t.features.items.courses.title} body={t.features.items.courses.body} />
                <Card title={t.features.items.bookstore.title} body={t.features.items.bookstore.body} />
                <Card title={t.features.items.aiHub.title} body={t.features.items.aiHub.body} />
                <Card title={t.features.items.planner.title} body={t.features.items.planner.body} />
                <Card title={t.features.items.koreaLife.title} body={t.features.items.koreaLife.body} />
                <div className="rounded-xl border border-[#b57edc]/20 bg-white/[0.03] p-5">
                  <h3 className="mb-2 text-base font-semibold text-[#e0c8ff]">{t.hero.install.label}</h3>
                  <p className="mb-3 text-sm leading-6 text-[#a8a0b0]">{t.hero.install.iosInstructions}</p>
                  <InstallAppButton
                    label={t.hero.install.label}
                    iosLabel={t.hero.install.iosLabel}
                    iosInstructions={t.hero.install.iosInstructions}
                  />
                </div>
              </div>
            </div>
          )}

          {active === "contact" && (
            <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-14 sm:px-10">
              <h2 className="mb-2 text-2xl font-semibold text-[#f5e6d3] sm:text-3xl">{navLabels.contact}</h2>
              <p className="mb-8 text-sm text-[#b8a8c0]">{t.contactIntro}</p>
              <div className="flex flex-col gap-3">
                {socials.map((k) => {
                  const Icon = CONTACT_ICONS[k];
                  return (
                    <a
                      key={k}
                      href={CONTACT_LINKS[k](CONTACT[k])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-[#b57edc]/20 bg-white/[0.03] px-4 py-3 text-sm text-[#e0e0e0] transition hover:border-[#b57edc]/40 hover:bg-[#b57edc]/10"
                    >
                      <Icon width={18} height={18} />
                      {CONTACT_LINKS[k](CONTACT[k])}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/5 bg-[#1f1f2e] px-6 py-4 text-xs text-[#808090] sm:flex-row sm:px-10">
        <span>
          © {new Date().getFullYear()} KoreaFarsi — {t.footer.rights}
        </span>
        <span className="text-[#a0a0b0]">{siteDomain}</span>
      </footer>
    </div>
  );
}
