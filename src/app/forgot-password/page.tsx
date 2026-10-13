import type { Metadata } from "next";
import { SiteAuthShell } from "@/components/site/auth/SiteAuthShell";
import { SiteForgotForm } from "@/components/site/auth/SiteForgotForm";
import { SitePage } from "@/components/site/SitePage";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.forgot.metaTitle, robots: { index: false } };
}

export default async function SiteForgotPage() {
  const { m } = await getMessages();
  return (
    <SitePage>
      <SiteAuthShell kicker={m.site.auth.forgotKicker} title={m.auth.forgot.title} subtitle={m.auth.forgot.subtitle} perks={m.site.auth.perks} ko="비밀번호">
        <SiteForgotForm />
      </SiteAuthShell>
    </SitePage>
  );
}
