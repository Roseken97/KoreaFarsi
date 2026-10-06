import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/server";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.forgot.metaTitle };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
