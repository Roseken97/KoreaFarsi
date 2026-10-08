import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { adminMfaRequired, getAdminCandidate, hasSecondFactor } from "@/lib/admin";
import { getMessages } from "@/lib/i18n/server";
import { MfaForm } from "./MfaForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.adminHub.mfa.title, robots: { index: false } };
}

/** Second factor for admins: set up an authenticator app once, then enter its code each sign-in. */
export default async function AdminMfaPage(props: PageProps<"/admin/mfa">) {
  const [{ m }, user, { next }] = await Promise.all([getMessages(), getAdminCandidate(), props.searchParams]);
  const t = m.account.adminHub;
  const target = typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (user && (!adminMfaRequired() || (await hasSecondFactor()))) redirect(target);

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.mfa.title} backHref="/account" backLabel={m.account.title} />
      {user ? <MfaForm next={target} t={t.mfa} /> : <Notice tone="error">{t.forbidden}</Notice>}
    </div>
  );
}
