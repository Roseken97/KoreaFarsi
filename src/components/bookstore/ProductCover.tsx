import Image from "next/image";
import type { Collection, Product } from "@/lib/bookstore/types";

/**
 * Real cover when cover_image_url is set; otherwise a designed placeholder
 * cover in brand colors (so sample / not-yet-photographed products still look intentional).
 */
const COVER_STYLE: Record<Collection | "default", { bg: string; glyph: string; text: string }> = {
  alphabet: { bg: "bg-violet", glyph: "한글", text: "text-white" },
  four_skills: { bg: "bg-teal-deep", glyph: "한국어", text: "text-cream" },
  workbook: { bg: "bg-blush-soft", glyph: "연습", text: "text-ink" },
  planner: { bg: "bg-sage-soft", glyph: "계획", text: "text-teal-deep" },
  merch: { bg: "bg-cream-deep", glyph: "굿즈", text: "text-ink" },
  default: { bg: "bg-cream-deep", glyph: "책", text: "text-ink" },
};

export function ProductCover({
  product,
  sizes = "200px",
  className = "",
  mini = false,
}: {
  product: Product;
  sizes?: string;
  className?: string;
  /** Thumbnail for lists (cart, bundle contents): colored block + glyph only. */
  mini?: boolean;
}) {
  if (product.cover_image_url) {
    return (
      <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-deep shadow-soft ${className}`}>
        <Image src={product.cover_image_url} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const style = COVER_STYLE[product.collection ?? "default"];

  if (mini) {
    return (
      <div
        className={`grid aspect-[3/4] place-items-center overflow-hidden rounded-lg ${style.bg} ${style.text} ${className}`}
        aria-hidden="true"
      >
        <span lang="ko" className="text-[10px] font-bold">
          {style.glyph}
        </span>
      </div>
    );
  }

  const isBundle = product.category === "bundle";

  return (
    <div
      className={`@container relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl p-3 shadow-soft ${style.bg} ${style.text} ${className}`}
      aria-hidden="true"
    >
      {/* spine */}
      <span className="absolute inset-y-0 start-0 w-2 bg-black/10" />
      {isBundle && (
        <>
          <span className="absolute -end-3 top-3 h-[85%] w-full rounded-2xl bg-black/5" />
          <span className="absolute -end-1.5 top-1.5 h-[92%] w-full rounded-2xl bg-black/5" />
        </>
      )}
      {/* top row left empty: card badges (Sample / Coming soon / discount) overlay here */}
      <span className="h-4" />
      {/* Glyph scales with the cover width so 3-syllable words never wrap on small covers */}
      <span lang="ko" className="relative text-center text-[20cqw] leading-none font-bold tracking-tight whitespace-nowrap">
        {style.glyph}
      </span>
      <span dir="ltr" className="relative line-clamp-2 ps-2 text-[10px] leading-tight font-medium opacity-80">
        {product.title_en ?? product.title}
      </span>
    </div>
  );
}
