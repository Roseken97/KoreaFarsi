import type { Metadata } from "next";
import { safeNext } from "@/lib/auth/validation";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "ثبت‌نام" };

export default async function SignupPage(props: PageProps<"/auth/signup">) {
  const { next } = await props.searchParams;
  return <SignupForm next={safeNext(typeof next === "string" ? next : null)} />;
}
