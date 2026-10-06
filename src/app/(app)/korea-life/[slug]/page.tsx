import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LanternIcon } from "@/components/icons";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { getKoreaLifePost } from "@/lib/korealife/queries";
import { getMessages } from "@/lib/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getKoreaLifePost(slug);
  return { title: post?.title ?? "Korea Life" };
}

export default async function KoreaLifePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ m, locale }, post] = await Promise.all([getMessages(), getKoreaLifePost(slug)]);
  if (!post) notFound();
  const t = m.koreaLife;

  const title = locale === "en" ? post.title_en || post.title : post.title;
  const body = locale === "en" ? post.body_en || post.body : post.body;

  return (
    <div className="animate-fade-up max-w-2xl">
      <SubPageHeader title={t.title} backHref="/korea-life" backLabel={t.title} />

      <div className="relative h-52 w-full overflow-hidden rounded-hero bg-blush-soft shadow-soft">
        {post.cover_image_url ? (
          <Image src={post.cover_image_url} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-blush">
            <LanternIcon width={48} height={48} />
          </span>
        )}
      </div>

      <span className="mt-4 inline-block text-xs font-semibold tracking-wide text-teal-deep uppercase">{t.categories[post.category]}</span>
      <h1 className="mt-1 font-display text-2xl font-bold text-ink" dir="auto">
        {title}
      </h1>

      {body && (
        <p className="mt-4 text-[15px] leading-7 whitespace-pre-line text-ink-soft" dir="auto">
          {body}
        </p>
      )}
    </div>
  );
}
