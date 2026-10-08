import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { LogoMark } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { HeroVideo } from "@/components/homepage/HeroVideo";
import { GlassCore } from "@/components/homepage/GlassCore";
import { InstallCta } from "@/components/homepage/InstallCta";
import { Odometer } from "@/components/homepage/Odometer";
import { Phone3D } from "@/components/homepage/Phone3D";
import { BlossomGuide } from "@/components/homepage/blossom/BlossomGuide";
import styles from "@/components/homepage/homepage.module.css";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import { getMessages } from "@/lib/i18n/server";

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "500"] });

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: { absolute: m.homepage.metaTitle } };
}

const FEATURES = [
  { key: "courses", glow: "183,156,255" },
  { key: "vocab", glow: "47,230,224" },
  { key: "ai", glow: "255,143,199" },
  { key: "speaking", glow: "255,197,154" },
  { key: "progress", glow: "93,143,232" },
  { key: "motivation", glow: "255,183,43" },
] as const;

const STATS = [
  { key: "followers", color: "#2FE6E0" },
  { key: "experience", color: "#FF8FC7" },
  { key: "teaching", color: "#B79CFF" },
] as const;

/** Rose's portrait for the about section; until it is added the frame shows the brand mark. */
const TEACHER_PHOTO: string | null = null;

const SOCIALS = (["instagram", "telegram", "youtube"] as const).filter((k) => CONTACT[k]);

/** Public homepage at "/" — the app itself opens at /launch (the PWA start_url). */
export default async function HomePage() {
  const { m, locale } = await getMessages();
  const t = m.homepage;
  const showLatinSub = locale === "fa";

  const brand = (
    <span dir="ltr" className={`${outfit.className} font-extralight tracking-[0.03em] text-white`}>
      KOREA<span className="font-light text-[#2FE6E0]">FARSI</span>
    </span>
  );

  const placementCta = (
    <Link
      href="/auth/welcome"
      className={`inline-flex min-h-[54px] items-center gap-2.5 rounded-full px-7 text-[17px] font-extrabold text-white ${styles.glassPill}`}
    >
      {t.hero.placement}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );

  const installCta = (
    <InstallCta
      label={t.hero.download}
      iosTitle={t.hero.iosTitle}
      iosInstructions={m.marketing.hero.install.iosInstructions}
      closeLabel={t.hero.close}
    />
  );

  const pathSteps = [
    { key: "alphabet", sub: "Alphabet", ring: "#FF8FC7", glyph: "ㄱ" },
    { key: "courses", sub: "Courses", ring: "#B79CFF", icon: <path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5" /> },
    { key: "practice", sub: "Practice", ring: "#8B5CF6", icon: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /> },
    { key: "ai", sub: "AI", ring: "#5D8FE8", icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /> },
    { key: "progress", sub: "Progress", ring: "#2FE6E0", icon: <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />, filled: true },
  ] as const;

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#140E26] text-[17px] leading-[1.8] text-[#F4EEFF]">
      <BlossomGuide />

      {/* ── 01 Hero: full-screen film, centered brand, two keys ── */}
      <section id="top" className="relative h-dvh max-h-[1000px] min-h-[640px] overflow-hidden">
        <HeroVideo playLabel={t.hero.play} pauseLabel={t.hero.pause} />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(20,14,38,0) 0%, rgba(20,14,38,0.08) 30%, rgba(20,14,38,0.18) 50%, rgba(20,14,38,0.78) 82%, #140E26 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 45% at 50% 52%, rgba(20,14,38,0.5) 0%, rgba(20,14,38,0) 100%)" }}
        />

        {/* ── 02 Navigation: background-less bar, glass pills ── */}
        <header className="relative z-20 mx-auto max-w-[1240px] px-6 pt-5">
          <nav aria-label={t.nav.features} className="flex flex-wrap items-center justify-between gap-3.5">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <LogoMark size={40} priority />
              <span className="text-[17px] font-extrabold">{t.footer.colBrand}</span>
            </Link>
            <div className="hidden flex-wrap justify-center gap-2 text-sm font-bold md:flex">
              {([
                ["#about", t.nav.about],
                ["#app", t.nav.app],
                ["#features", t.nav.features],
                ["#path", t.nav.courses],
              ] as const).map(([href, label]) => (
                <a key={href} href={href} className={`rounded-full px-5 py-2 text-white ${styles.glassPill}`}>
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <LanguageSwitch />
              <Link href="/auth/login" className={`rounded-full px-5 py-2 text-white ${styles.glassPill}`}>
                {t.nav.login}
              </Link>
              <Link href="/auth/welcome" className="rounded-full bg-white/90 px-5 py-2 font-extrabold text-[#1C1336] backdrop-blur-md">
                {t.nav.start}
              </Link>
            </div>
          </nav>
        </header>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 pt-24 pb-16">
          <div className="pointer-events-auto flex max-w-[1000px] flex-col items-center gap-5 text-center">
            <h1 aria-label="KoreaFarsi" className="m-0 text-[clamp(54px,11vw,168px)] leading-[0.95] [text-shadow:0_8px_40px_rgba(20,14,38,0.5)]">
              {brand}
            </h1>
            <p className="m-0 max-w-[760px] text-[clamp(19px,2.2vw,28px)] leading-[1.7] text-white [text-shadow:0_2px_20px_rgba(20,14,38,0.7)]">
              {t.hero.taglineA} <strong className="font-extrabold">{t.hero.taglineB}</strong>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2.5">
              {installCta}
              {placementCta}
            </div>
          </div>
        </div>

        <a
          href="#about"
          aria-label={t.hero.scroll}
          className="absolute bottom-6 left-1/2 z-20 flex h-[46px] w-[30px] -translate-x-1/2 justify-center rounded-2xl border-[1.5px] border-white/60 pt-2"
        >
          <span className={`h-[9px] w-1 rounded-sm bg-white ${styles.cue}`} />
        </a>
      </section>

      {/* ── 03 What is KoreaFarsi: teacher photo + role card, then story beside counting stats ── */}
      <section id="about" className="relative scroll-mt-6 overflow-clip px-6 pt-28 pb-24">
        <div aria-hidden="true" className="absolute -end-16 -bottom-20 size-80 rounded-full bg-[#8B5CF6] opacity-25 blur-[120px]" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div id="teacher" data-guide="photo" data-guide-at="start-top" className={`relative mx-auto w-full max-w-[380px] pb-10 lg:mx-0 ${styles.spinCard}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/15 shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
              {TEACHER_PHOTO ? (
                <Image src={TEACHER_PHOTO} alt={t.about.teacherName} fill sizes="380px" className="object-cover" />
              ) : (
                <div className="grid size-full place-items-center" style={{ background: "radial-gradient(circle at 30% 25%, #FFE3F0 0%, #FF8FC7 40%, #8B5CF6 100%)" }}>
                  <LogoMark size={150} />
                </div>
              )}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#140E26]/60 to-transparent" />
            </div>
            <div className="absolute -end-4 bottom-0 z-10 flex items-center gap-3 rounded-[22px] border border-white/25 bg-[#241A45]/70 px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:-end-10">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#2FE6E0] shadow-[0_0_12px_#2FE6E0]" />
              <span className="flex flex-col leading-snug">
                <span dir="ltr" className={`${outfit.className} text-start text-lg font-medium text-white`}>
                  {t.about.teacherName}
                </span>
                <span className="text-sm text-[#E4DAF7]">{t.about.teacherRole}</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 flex min-w-0 flex-col gap-[18px]">
            <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.about.eyebrow}</span>
            <h2 className="m-0 text-[clamp(30px,4vw,50px)] leading-[1.35] font-black text-white">
              {t.about.titleA}
              <br />
              {t.about.titleB}
            </h2>
          </div>

          <div className="relative z-10 flex min-w-0 flex-col gap-6">
            <p className="m-0 max-w-[560px] text-lg text-[#CFC5E6]">{t.about.body}</p>
            <div
              className="flex flex-col gap-3.5 rounded-[26px] border border-white/15 p-[26px]"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(47,230,224,0.1) 100%)" }}
            >
              <span className="text-[17px] font-extrabold text-white">{t.about.philosophy.title}</span>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
                {(["active", "recycle", "skills"] as const).map((k) => (
                  <span key={k} className="flex flex-col gap-0.5">
                    <strong className="text-[15px] text-white">{t.about.philosophy[k].title}</strong>
                    <span className="text-[13px] text-[#C9BEE3]">{t.about.philosophy[k].body}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div data-guide="stats" data-guide-at="center-top" className="relative z-10 grid min-w-0 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
            {STATS.map(({ key, color }, i) => {
              const s = t.about.stats[key];
              return (
                <div key={key} className="flex flex-col gap-2 rounded-[26px] border border-white/12 bg-white/5 p-[26px] backdrop-blur-sm">
                  <Odometer value={s.value} delay={i * 0.25} className={`${outfit.className} text-start text-[52px] leading-none font-extralight`} style={{ color }} />
                  <span className="text-[17px] font-extrabold text-white">{s.label}</span>
                  <span className="text-sm text-[#C9BEE3]">{s.body}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 The app: one 3D phone that turns with the scroll while the app screens scroll inside it ── */}
      <section id="app" className="relative scroll-mt-6 overflow-clip bg-[#1C1336] pt-[104px]">
        <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center gap-4 px-6 text-center">
          <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.app.eyebrow}</span>
          <h2 className="m-0 text-[clamp(30px,4.2vw,54px)] leading-[1.35] font-black text-white">{t.app.title}</h2>
          <p className="m-0 text-lg text-[#CFC5E6]">{t.app.body}</p>
        </div>

        <Phone3D
          screens={[
            { src: "/landing/screens/home.webp", alt: t.app.screenHome },
            { src: "/landing/screens/onboarding.webp", alt: t.app.screenOnboarding },
            { src: "/landing/screens/welcome.webp", alt: t.app.screenWelcome },
          ]}
        >
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6] opacity-35 blur-[160px]" />
          <GlassCore />
          <div aria-hidden="true" className={`pointer-events-none absolute top-1/2 left-1/2 z-0 size-[900px] -translate-x-1/2 -translate-y-1/2 [perspective:1200px] ${styles.hideSm}`}>
            <div className={`absolute inset-0 rounded-full border-[1.5px] border-[#2FE6E0]/35 shadow-[0_0_30px_rgba(47,230,224,0.15)] ${styles.orbit}`}>
              <span className="absolute -top-[7px] left-1/2 size-3.5 rounded-full bg-[#2FE6E0] shadow-[0_0_18px_#2FE6E0]" />
            </div>
            <div className={`absolute inset-[90px] rounded-full border-[1.5px] border-[#FF8FC7]/30 ${styles.orbitB}`}>
              <span className="absolute -bottom-1.5 left-[30%] size-3 rounded-full bg-[#FF8FC7] shadow-[0_0_16px_#FF8FC7]" />
            </div>
          </div>
        </Phone3D>

        <div className="relative z-10 flex flex-wrap justify-center gap-3 px-6 pb-28">
          <Link href="/bookstore" className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-[18px] py-2.5 text-sm text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8FC7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
            </svg>
            {t.app.chipBooks}
          </Link>
          <Link href="/courses" className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-[18px] py-2.5 text-sm text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE6E0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="15" r="4" />
              <path d="M11 12l9-9M17 6l3 3M15 8l2 2" />
            </svg>
            {t.app.chipKoreaKey}
          </Link>
        </div>
      </section>

      {/* ── 05 Key features: 3D icons ── */}
      <section id="features" className="relative scroll-mt-6 px-6 py-[104px]">
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-10">
          <div className="flex max-w-[620px] flex-col gap-2.5">
            <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.features.eyebrow}</span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,44px)] leading-[1.4] font-black text-white">
              {t.features.titleA}
              <br />
              {t.features.titleB}
            </h2>
          </div>
          <div data-guide="features" data-guide-at="start-top" className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px]">
            {FEATURES.map(({ key, glow }, i) => (
              <div key={key} className={styles.flipIn} style={{ "--i": i } as React.CSSProperties}>
              <div className={`flex h-full flex-col gap-3 rounded-[28px] border border-white/12 bg-white/5 p-7 ${styles.card}`}>
                <Image
                  src={`/landing/icons/${key}.webp`}
                  alt=""
                  width={120}
                  height={120}
                  className={`-ms-2.5 -mt-3.5 -mb-2 ${styles.float}`}
                  style={{
                    animationDelay: `-${(i * 0.8).toFixed(1)}s`,
                    filter: `drop-shadow(0 18px 26px rgba(0,0,0,0.35)) drop-shadow(0 0 22px rgba(${glow},0.35))`,
                  }}
                />
                <h3 className="m-0 text-xl font-black text-white">{t.features[key].title}</h3>
                <p className="m-0 text-[15px] text-[#C9BEE3]">{t.features[key].body}</p>
              </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Learning path ── */}
      <section id="path" className="relative scroll-mt-6 overflow-hidden bg-[#1C1336] px-6 py-[104px]">
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-[52px]">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <span className="text-[13px] font-extrabold tracking-wide text-[#6FF3EE]">{t.path.eyebrow}</span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,44px)] leading-[1.4] font-black text-white">{t.path.title}</h2>
            <p className="m-0 text-[17px] text-[#C9BEE3]">{t.path.body}</p>
          </div>
          <div data-guide="path" data-guide-at="start-top" className="relative mx-auto w-full max-w-[340px] md:max-w-none">
            {/* desktop: horizontal line with a dot travelling along it */}
            <div
              aria-hidden="true"
              className={`absolute inset-x-[10%] top-11 hidden h-0.5 opacity-70 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#FF8FC7] via-[#8B5CF6] to-[#2FE6E0] md:block ${styles.drawLine}`}
            />
            <span
              aria-hidden="true"
              className={`absolute top-[38px] -ms-[7px] hidden size-3.5 rounded-full bg-white shadow-[0_0_12px_#fff,0_0_30px_#B79CFF,0_0_50px_#2FE6E0] md:block ${styles.travel}`}
            />
            {/* mobile: the same path as a vertical line through the circles, dot travelling down */}
            <div
              aria-hidden="true"
              className={`absolute start-[35px] top-9 bottom-9 w-0.5 bg-gradient-to-b from-[#FF8FC7] via-[#8B5CF6] to-[#2FE6E0] opacity-70 md:hidden ${styles.drawLineY}`}
            >
              <span className={`absolute start-1/2 -ms-[7px] size-3.5 rounded-full bg-white shadow-[0_0_12px_#fff,0_0_30px_#B79CFF,0_0_50px_#2FE6E0] ${styles.travelDown}`} />
            </div>
            <ol className="relative m-0 grid list-none grid-cols-1 gap-7 p-0 md:grid-cols-5 md:gap-6">
              {pathSteps.map((s, i) => (
                <li key={s.key} className={`flex flex-row items-center gap-5 text-start md:flex-col md:gap-2.5 md:text-center ${styles.popStep}`} style={{ "--i": i } as React.CSSProperties}>
                  <span
                    className={`grid size-[72px] shrink-0 place-items-center rounded-full md:size-[88px] ${styles.pulse}`}
                    style={{
                      animationDelay: `${i}s`,
                      background: "filled" in s ? s.ring : "#2A1D4E",
                      border: "filled" in s ? "none" : `2px solid ${s.ring}`,
                      boxShadow: `0 0 34px ${s.ring}66`,
                      color: "filled" in s ? "#0F1A2E" : "#FFFFFF",
                    }}
                  >
                    {"glyph" in s ? (
                      <span lang="ko" className="text-[30px] font-black md:text-[34px]">{s.glyph}</span>
                    ) : (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {s.icon}
                      </svg>
                    )}
                  </span>
                  <span className="flex flex-col md:items-center">
                    <span className="text-lg font-extrabold text-white">{t.path[s.key]}</span>
                    {showLatinSub && (
                      <span dir="ltr" className={`${outfit.className} text-[13px] tracking-[0.06em] text-[#C9BEE3] rtl:text-end md:rtl:text-center`}>
                        {s.sub}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 07 Final CTA ── */}
      <section id="start" className={`relative flex flex-col items-center overflow-hidden px-6 py-[140px] text-center ${styles.ctaBg}`}>
        <div aria-hidden="true" className={`pointer-events-none absolute top-1/2 left-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 [perspective:1200px] ${styles.hideSm}`}>
          <div className={`absolute inset-0 rounded-full border-[1.5px] border-white/25 ${styles.orbit}`}>
            <span className="absolute -top-1.5 left-1/2 size-3 rounded-full bg-white shadow-[0_0_16px_#fff,0_0_30px_#2FE6E0]" />
          </div>
        </div>
        <div data-guide="cta" data-guide-at="center-top" className="relative z-10 flex max-w-[680px] flex-col items-center gap-5">
          <h2 style={{ "--i": 0 } as React.CSSProperties} className={`${styles.rise} m-0 text-[clamp(32px,5vw,60px)] leading-[1.3] font-black text-white [text-shadow:0_4px_30px_rgba(20,14,38,0.6)]`}>{t.cta.title}</h2>
          <p style={{ "--i": 1 } as React.CSSProperties} className={`${styles.rise} m-0 text-lg text-[#F1E8FF] [text-shadow:0_2px_16px_rgba(20,14,38,0.7)]`}>{t.cta.body}</p>
          <div style={{ "--i": 2 } as React.CSSProperties} className={`${styles.rise} flex flex-wrap justify-center gap-3 pt-1.5`}>
            {installCta}
            {placementCta}
          </div>
        </div>
      </section>

      {/* ── 08 Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#140E26] px-6 pt-14 pb-9">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-9">
          <div className="flex flex-wrap justify-between gap-8">
            <div className="flex flex-[1_1_260px] flex-col gap-2.5">
              <span className="text-[30px]">{brand}</span>
              <span className="text-sm text-[#C9BEE3]">{t.footer.tagline}</span>
              <div className="flex gap-2.5 pt-1.5">
                {SOCIALS.map((k) => (
                  <a
                    key={k}
                    href={CONTACT_LINKS[k](CONTACT[k])}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={k}
                    className="grid size-11 place-items-center rounded-full border border-white/20 text-white"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {k === "instagram" && (
                        <>
                          <rect x="3" y="3" width="18" height="18" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                        </>
                      )}
                      {k === "telegram" && <path d="M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l12-9" />}
                      {k === "youtube" && (
                        <>
                          <rect x="2" y="5" width="20" height="14" rx="4" />
                          <path d="M10 9l5 3-5 3z" />
                        </>
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <nav aria-label={t.footer.colBrand} className="flex flex-[0_1_180px] flex-col gap-2 text-sm">
              <span className="mb-1 font-extrabold text-white">{t.footer.colBrand}</span>
              <a href="#about" className="text-[#C9BEE3] hover:text-white">{t.footer.about}</a>
              <a href="#teacher" className="text-[#C9BEE3] hover:text-white">{t.footer.teacher}</a>
              {CONTACT.telegram && (
                <a href={CONTACT_LINKS.telegram(CONTACT.telegram)} target="_blank" rel="noopener noreferrer" className="text-[#C9BEE3] hover:text-white">
                  {t.footer.contact}
                </a>
              )}
            </nav>
            <nav aria-label={t.footer.colLearn} className="flex flex-[0_1_180px] flex-col gap-2 text-sm">
              <span className="mb-1 font-extrabold text-white">{t.footer.colLearn}</span>
              <Link href="/bookstore" className="text-[#C9BEE3] hover:text-white">{t.footer.books}</Link>
              <Link href="/courses" className="text-[#C9BEE3] hover:text-white">{t.footer.koreakey}</Link>
              <Link href="/launch" className="text-[#C9BEE3] hover:text-white">{t.footer.app}</Link>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5 text-[13px] text-[#A99FC4]">
            <span>{t.footer.rights}</span>
            <EnamadSeal />
          </div>
        </div>
      </footer>
    </div>
  );
}

const ENAMAD_ID = "8067603";
const ENAMAD_CODE = "iSNyTR36xvjn5oLYMQAnZteYbDjknYd1";

/** eNAMAD trust seal, kept as eNAMAD's own snippet (referrer + code attribute) so its check still recognises it. */
function EnamadSeal() {
  const query = `id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`;
  return (
    <a referrerPolicy="origin" target="_blank" href={`https://trustseal.enamad.ir/?${query}`} className="rounded-xl bg-white p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- eNAMAD serves the seal image itself */}
      <img
        referrerPolicy="origin"
        src={`https://trustseal.enamad.ir/logo.aspx?${query}`}
        alt="نماد اعتماد الکترونیکی"
        width={72}
        style={{ cursor: "pointer", height: "auto" }}
        {...{ code: ENAMAD_CODE }}
      />
    </a>
  );
}
