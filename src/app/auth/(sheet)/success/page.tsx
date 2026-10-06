import type { Metadata } from "next";
import { StatusScreen } from "@/components/auth/StatusScreen";
import { CheckCircleIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { safeNext } from "@/lib/auth/validation";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.success.metaTitle };
}

/** Auth step 7 (sketch 03): "You're In!" after signup / email confirmation / password reset. */
export default async function SuccessPage(props: PageProps<"/auth/success">) {
  const [{ m }, { next }] = await Promise.all([getMessages(), props.searchParams]);
  const t = m.auth.success;

  return (
    <StatusScreen
      icon={<CheckCircleIcon width={32} height={32} />}
      title={t.title}
      action={<ButtonLink variant="navy" href={safeNext(typeof next === "string" ? next : null)}>{t.cta}</ButtonLink>}
    >
      <p>{t.body}</p>
    </StatusScreen>
  );
}
