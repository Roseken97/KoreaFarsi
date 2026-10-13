import type { Metadata } from "next";
import { safeNext } from "@/lib/auth/validation";
import { getProducts } from "@/lib/bookstore/catalog";
import { levelBucket } from "@/lib/courses/types";
import { getCardImages } from "@/lib/card-images/queries";
import { getMessages } from "@/lib/i18n/server";
import { SignupForm } from "./SignupForm";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.auth.signup.metaTitle };
}

export default async function SignupPage(props: PageProps<"/auth/signup">) {
  const [{ next }, images, products] = await Promise.all([props.searchParams, getCardImages(), getProducts()]);
  // Course products feed the level prompt that opens over the form.
  const levelCourses = products
    .filter((p) => p.category === "course")
    .map((p) => ({ slug: p.slug, title: p.title, title_en: p.title_en, level: levelBucket(p.level) }));
  return <SignupForm next={safeNext(typeof next === "string" ? next : null)} image={images["auth.signup"]} levelCourses={levelCourses} />;
}
