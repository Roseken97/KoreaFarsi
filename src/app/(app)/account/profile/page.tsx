import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { Notice } from "@/components/ui/Notice";
import { getMessages } from "@/lib/i18n/server";
import { getProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ProfileForm } from "./ProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.account.profile.metaTitle };
}

export default async function EditProfilePage() {
  const [{ m }, profile] = await Promise.all([getMessages(), getProfile()]);
  if (isSupabaseConfigured && !profile) redirect("/auth/login?next=/account/profile");

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={m.account.profile.title} backHref="/account" backLabel={m.account.title} />
      {profile ? (
        <ProfileForm
          userId={profile.user.id}
          initialName={profile.name ?? ""}
          email={profile.user.email ?? ""}
          initialAvatarKey={profile.avatarKey}
          initialCustomAvatarUrl={profile.customAvatarUrl}
        />
      ) : (
        <Notice>{m.account.notConfigured}</Notice>
      )}
    </div>
  );
}
