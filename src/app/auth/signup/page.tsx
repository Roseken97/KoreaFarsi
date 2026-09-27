import type { Metadata } from "next";
import { safeNext } from "@/lib/auth/validation";
import { getMessages } from "@/lib/i18n/server";
import { SignupForm } from "./SignupForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.signup.metaTitle };
}

export default async function SignupPage(props: PageProps<"/auth/signup">) {
  const { next } = await props.searchParams;
  return <SignupForm next={safeNext(typeof next === "string" ? next : null)} />;
}
