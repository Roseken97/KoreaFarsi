import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronIcon } from "@/components/icons";
import { SitePage } from "@/components/site/SitePage";
import { getKoreaLifePost } from "@/lib/korealife/queries";
import { getMessages } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/magazine/[slug]">): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([props.params, getMessages()]);
  const post = await getKoreaLifePost(slug);
  if (!post) return { title: "Korea Life" };
  const title = locale === "en" ? post.title_en || post.title : post.title;
  const description = (locale === "en" ? post.excerpt_en || post.excerpt : post.excerpt) ?? undefined;
  return {
    title,
    description,
    alternates: localeAlternates(`/magazine/${slug}`, locale),
    openGraph: { type: "article", title, description, ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}) },
  };
}

/** One magazine article on the website. */
export default async function MagazinePostPage(props: PageProps<"/magazine/[slug]">) {
  const { slug } = await props.params;
  const [{ m, locale }, post] = await Promise.all([getMessages(), getKoreaLifePost(slug)]);
  if (!post) notFound();

  const title = locale === "en" ? post.title_en || post.title : post.title;
  const body = locale === "en" ? post.body_en || post.body : post.body;

  return (
    <SitePage>
      <article className="mx-auto max-w-[820px] px-5 pt-12 pb-24 sm:px-6">
        <Link href="/magazine" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6FF3EE] hover:underline">
          <ChevronIcon width={16} height={16} className="rotate-180" />
          {m.site.koreaLife.back}
        </Link>
        <span className="mt-6 block text-[13px] font-extrabold tracking-wide text-[#FFB72B]">{m.koreaLife.categories[post.category]}</span>
        <h1 className="m-0 mt-2 text-[clamp(28px,4.4vw,46px)] leading-[1.35] font-black text-white" dir="auto">
          {title}
        </h1>
        {post.cover_image_url && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-white/10">
            <Image src={post.cover_image_url} alt="" fill priority sizes="(min-width: 860px) 820px, 100vw" className="object-cover" />
          </div>
        )}
        {body && (
          <p className="mt-8 text-[17px] leading-[2] whitespace-pre-line text-[#E4DAF7]" dir="auto">
            {body}
          </p>
        )}
      </article>
    </SitePage>
  );
}
