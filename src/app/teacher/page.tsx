import type { Metadata } from "next";
import Image from "next/image";
import { SiteCta } from "@/components/site/SiteCta";
import { SitePage } from "@/components/site/SitePage";
import { TEACHER_PHOTO } from "@/config/media";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { m, locale } = await getMessages();
  return { title: m.site.teacher.metaTitle, description: m.site.teacher.metaDescription, alternates: localeAlternates("/teacher", locale) };
}

const STATS = [
  { key: "followers", color: "#2FE6E0" },
  { key: "experience", color: "#FF8FC7" },
  { key: "teaching", color: "#B79CFF" },
] as const;

/** Meet the teacher: portrait, name and role, a short story and the numbers from the homepage. */
export default async function TeacherPage() {
  const { m } = await getMessages();
  const a = m.homepage.about;
  const t = m.site.teacher;

  return (
    <SitePage>
      <section className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 start-0 size-[380px] rounded-full bg-[#FF8FC7] opacity-25 blur-[130px]" />
        <div className="relative mx-auto w-full max-w-[360px] lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/15 shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
            <Image src={TEACHER_PHOTO} alt={a.teacherName} fill priority sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
          </div>
        </div>
        <div className="relative flex flex-col gap-4">
          <span className="text-[13px] font-extrabold tracking-wide text-[#FF8FC7]">{t.kicker}</span>
          <h1 className="m-0 text-[clamp(34px,5vw,56px)] leading-tight font-black text-white">{a.teacherName}</h1>
          <p className="m-0 text-lg font-bold text-[#E4DAF7]">{a.teacherRole}</p>
          <p className="m-0 max-w-[620px] text-[#C9BEE3]">{t.body}</p>
          <div className="pt-2">
            <SiteCta
              links={[
                { href: "/shop/courses", label: t.ctaCourses },
                { href: "/contact", label: t.ctaContact },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-4 px-5 pb-24 sm:grid-cols-3 sm:px-6">
        {STATS.map(({ key, color }) => {
          const s = a.stats[key];
          return (
            <div key={key} className="flex flex-col gap-2 rounded-[26px] border border-white/12 bg-white/5 p-7">
              <span dir="ltr" className="text-start text-[44px] leading-none font-light rtl:text-end" style={{ color }}>
                {s.value}
              </span>
              <span className="text-[17px] font-extrabold text-white">{s.label}</span>
              <span className="text-sm text-[#C9BEE3]">{s.body}</span>
            </div>
          );
        })}
      </section>
    </SitePage>
  );
}
