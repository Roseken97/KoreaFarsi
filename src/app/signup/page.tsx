import type { Metadata } from "next";
import { SiteAuthShell } from "@/components/site/auth/SiteAuthShell";
import { SiteSignupForm } from "@/components/site/auth/SiteSignupForm";
import { SitePage } from "@/components/site/SitePage";
import { safeNext } from "@/lib/auth/validation";
import { getProducts } from "@/lib/bookstore/catalog";
import { levelBucket } from "@/lib/courses/types";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.signup.metaTitle, robots: { index: false } };
}

/** Website signup (the app keeps /auth/signup); opens with the level question. */
export default async function SiteSignupPage(props: PageProps<"/signup">) {
  const [{ m }, { next }, products] = await Promise.all([getMessages(), props.searchParams, getProducts()]);
  const t = m.site.auth;
  const levelCourses = products
    .filter((p) => p.category === "course")
    .map((p) => ({ slug: p.slug, title: p.title, title_en: p.title_en, level: levelBucket(p.level) }));
  return (
    <SitePage>
      <SiteAuthShell kicker={t.signupKicker} title={t.signupTitle} subtitle={t.signupSubtitle} perks={t.perks} ko="환영">
        <SiteSignupForm next={safeNext(typeof next === "string" ? next : null, "/my-account")} levelCourses={levelCourses} />
      </SiteAuthShell>
    </SitePage>
  );
}
