import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LanguageSwitch } from "@/components/shell/LanguageSwitch";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.metaTitle };
}

// Milestone 1 stub: sign-in state, language, sign-out.
// The full Account screen (sketch 05) lands in Milestone 2.
export default async function AccountPage() {
  const [{ m }, user] = await Promise.all([getMessages(), getCurrentUser()]);
  if (isSupabaseConfigured && !user) redirect("/auth/login?next=/account");

  const name = (user?.user_metadata?.name as string | undefined) ?? "—";

  return (
    <section className="animate-fade-up max-w-xl">
      <h1 className="font-display text-3xl font-semibold">{m.account.title}</h1>

      {!isSupabaseConfigured && (
        <div className="mt-6">
          <Notice>{m.account.notConfigured}</Notice>
        </div>
      )}

      <dl className="mt-6 divide-y divide-line rounded-card bg-surface p-2 shadow-soft">
        {user && (
          <>
            <Row label={m.account.name}>{name}</Row>
            <Row label={m.account.email}>
              <span dir="ltr">{user.email}</span>
            </Row>
          </>
        )}
        <Row label={m.language.label}>
          <LanguageSwitch />
        </Row>
      </dl>

      {user && (
        <div className="mt-6 max-w-xs">
          <SignOutButton label={m.account.signOut} />
        </div>
      )}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
