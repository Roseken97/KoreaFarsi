import type { Metadata } from "next";
import { safeNext } from "@/lib/auth/validation";
import { getCardImages } from "@/lib/card-images/queries";
import { getMessages } from "@/lib/i18n/server";
import { LoginForm } from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.login.metaTitle };
}

export default async function LoginPage(props: PageProps<"/auth/login">) {
  const [{ next, error }, images] = await Promise.all([props.searchParams, getCardImages()]);
  return (
    <LoginForm
      next={safeNext(typeof next === "string" ? next : null)}
      callbackFailed={error === "callback"}
      image={images["auth.login"]}
    />
  );
}
