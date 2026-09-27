import type { Metadata } from "next";
import { safeNext } from "@/lib/auth/validation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "ورود" };

export default async function LoginPage(props: PageProps<"/auth/login">) {
  const { next, error } = await props.searchParams;
  return (
    <LoginForm
      next={safeNext(typeof next === "string" ? next : null)}
      callbackFailed={error === "callback"}
    />
  );
}
