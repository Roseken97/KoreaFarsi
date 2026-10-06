import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/server";
import { ResetPasswordForm } from "./ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.reset.metaTitle };
}

// Reached via the recovery email → /auth/callback (which creates the session) → here.
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
