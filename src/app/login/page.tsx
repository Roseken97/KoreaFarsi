import type { Metadata } from "next";
import { SiteAuthShell } from "@/components/site/auth/SiteAuthShell";
import { SiteLoginForm } from "@/components/site/auth/SiteLoginForm";
import { SitePage } from "@/components/site/SitePage";
import { safeNext } from "@/lib/auth/validation";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.login.metaTitle, robots: { index: false } };
}

/** Website login (the app keeps /auth/login). Signed-in visitors are sent to /my-account by the proxy. */
export default async function SiteLoginPage(props: PageProps<"/login">) {
  const [{ m }, { next, error }] = await Promise.all([getMessages(), props.searchParams]);
  const t = m.site.auth;
  return (
    <SitePage>
      <SiteAuthShell kicker={t.loginKicker} title={t.loginTitle} subtitle={t.loginSubtitle} perks={t.perks} ko="로그인">
        <SiteLoginForm next={safeNext(typeof next === "string" ? next : null, "/my-account")} callbackFailed={error === "callback"} />
      </SiteAuthShell>
    </SitePage>
  );
}
