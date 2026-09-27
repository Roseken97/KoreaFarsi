import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ComingSoon } from "@/components/shell/ComingSoon";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = { title: "حساب من" };

// Milestone 1 stub: just enough to verify sign-in state and sign-out.
// The full Account screen (sketch 05) lands in Milestone 2.
export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return <ComingSoon title="حساب من" description="برای ورود و حساب کاربری، اتصال Supabase لازم است." />;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/account");

  const name = (user.user_metadata?.name as string | undefined) ?? "—";

  return (
    <section className="animate-fade-up">
      <h1 className="text-2xl font-bold">حساب من</h1>
      <dl className="mt-6 divide-y divide-line rounded-card bg-surface p-2 shadow-soft">
        <div className="flex items-center justify-between px-4 py-4">
          <dt className="text-sm text-ink-soft">نام</dt>
          <dd className="font-medium">{name}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-4">
          <dt className="text-sm text-ink-soft">ایمیل</dt>
          <dd className="font-medium" dir="ltr">
            {user.email}
          </dd>
        </div>
      </dl>
      <div className="mt-6 max-w-xs">
        <SignOutButton />
      </div>
    </section>
  );
}
