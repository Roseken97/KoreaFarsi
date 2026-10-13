import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstallCta } from "@/components/homepage/InstallCta";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getMessages } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return pageMetadata({ locale, path: "/app", title: m.site.app.metaTitle, description: m.site.app.metaDescription });
}

const FEATURES = ["courses", "vocab", "ai", "speaking", "progress", "motivation"] as const;

/** Website page about the app: what it does, three real screens and the install button. The app itself lives at /launch. */
export default async function AppIntroPage() {
  const { m } = await getMessages();
  const a = m.homepage.app;
  const f = m.homepage.features;
  const t = m.site.app;

  const screens = [
    { src: "/landing/screens/onboarding.webp", alt: a.screenOnboarding },
    { src: "/landing/screens/home.webp", alt: a.screenHome },
    { src: "/landing/screens/welcome.webp", alt: a.screenWelcome },
  ];

  return (
    <SitePage>
      <SiteIntro kicker={t.kicker} title={a.title} subtitle={a.body} ko="앱" accent="#5D8FE8">
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <InstallCta label={m.homepage.hero.download} iosTitle={m.homepage.hero.iosTitle} iosInstructions={m.marketing.hero.install.iosInstructions} closeLabel={m.homepage.hero.close} />
          <Link href="/launch" className="rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-[15px] font-bold text-white hover:bg-white/[0.1]">
            {t.open}
          </Link>
        </div>
      </SiteIntro>

      <section className="mx-auto flex max-w-[1200px] justify-center gap-4 overflow-hidden px-5 pb-16 sm:gap-8 sm:px-6">
        {screens.map((s, i) => (
          <div
            key={s.src}
            className={`relative aspect-[9/19.5] w-[30%] max-w-[260px] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.45)] ${i === 1 ? "" : "mt-10"}`}
          >
            <Image src={s.src} alt={s.alt} fill sizes="(min-width: 900px) 260px, 30vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-4 px-5 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {FEATURES.map((key) => (
          <div key={key} className="flex flex-col gap-2 rounded-[26px] border border-white/12 bg-white/5 p-6">
            <h2 className="m-0 text-lg font-black text-white">{f[key].title}</h2>
            <p className="m-0 text-[15px] text-[#C9BEE3]">{f[key].body}</p>
          </div>
        ))}
      </section>
    </SitePage>
  );
}
