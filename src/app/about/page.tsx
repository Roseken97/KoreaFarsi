import type { Metadata } from "next";
import Image from "next/image";
import { SiteCta } from "@/components/site/SiteCta";
import { SiteIntro } from "@/components/site/SiteIntro";
import { SitePage } from "@/components/site/SitePage";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.about.metaTitle, description: m.site.about.metaDescription, alternates: localeAlternates("/about", locale) };
}

const FEATURES = [
  { key: "courses", glow: "183,156,255" },
  { key: "vocab", glow: "47,230,224" },
  { key: "ai", glow: "255,143,199" },
  { key: "speaking", glow: "255,197,154" },
  { key: "progress", glow: "93,143,232" },
  { key: "motivation", glow: "255,183,43" },
] as const;

/** About KoreaFarsi: the story, how learning works here and the six features, in the website's look. */
export default async function AboutPage() {
  const { m } = await getMessages();
  const a = m.homepage.about;
  const f = m.homepage.features;
  const t = m.site.about;

  return (
    <SitePage>
      <SiteIntro kicker={a.eyebrow} title={`${a.titleA} ${a.titleB}`} subtitle={a.body} ko="소개" accent="#2FE6E0" />

      <section className="mx-auto max-w-[1200px] px-5 pb-16 sm:px-6">
        <div
          className="flex flex-col gap-4 rounded-[28px] border border-white/15 p-7"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(47,230,224,0.1) 100%)" }}
        >
          <h2 className="m-0 text-xl font-black text-white">{a.philosophy.title}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {(["active", "recycle", "skills"] as const).map((k) => (
              <div key={k} className="flex flex-col gap-1">
                <strong className="text-white">{a.philosophy[k].title}</strong>
                <span className="text-[15px] text-[#C9BEE3]">{a.philosophy[k].body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-16 sm:px-6">
        <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{f.eyebrow}</span>
        <h2 className="m-0 mt-2 text-[clamp(26px,3.4vw,40px)] leading-[1.4] font-black text-white">
          {f.titleA} {f.titleB}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, glow }) => (
            <div key={key} className="flex flex-col gap-3 rounded-[28px] border border-white/12 bg-white/5 p-7">
              <Image
                src={`/landing/icons/${key}.webp`}
                alt=""
                width={96}
                height={96}
                className="-ms-2 -mt-2"
                style={{ filter: `drop-shadow(0 14px 22px rgba(0,0,0,0.35)) drop-shadow(0 0 20px rgba(${glow},0.35))` }}
              />
              <h3 className="m-0 text-xl font-black text-white">{f[key].title}</h3>
              <p className="m-0 text-[15px] text-[#C9BEE3]">{f[key].body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 pb-24 sm:px-6">
        <h2 className="m-0 text-[clamp(24px,3vw,34px)] font-black text-white">{t.ctaTitle}</h2>
        <SiteCta
          links={[
            { href: "/shop", label: t.ctaShop },
            { href: "/teacher", label: m.homepage.menu.teacher },
          ]}
        />
      </section>
    </SitePage>
  );
}
