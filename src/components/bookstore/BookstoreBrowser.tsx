"use client";

import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import { SakuraBranch } from "@/components/brand/SakuraBranch";
import {
  ArrowForwardIcon,
  BooksStackIcon,
  HangulIcon,
  LayersIcon,
  PencilIcon,
  PlannerIcon,
  SparkleIcon,
  TagIcon,
} from "@/components/icons";
import type { Collection, Product } from "@/lib/bookstore/types";
import { useI18n } from "@/lib/i18n/client";
import { MESH } from "@/lib/ui/mesh";
import { BookstoreHeader } from "./BookstoreHeader";
import { BundleCard } from "./BundleCard";
import { ProductCard } from "./ProductCard";

type CollectionTab = "all" | Collection;
type FilterTab = "all" | "pdf" | "physical" | "bundles" | "coming";

const COLLECTION_TABS: { key: CollectionTab; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "all", Icon: BooksStackIcon },
  { key: "alphabet", Icon: HangulIcon },
  { key: "four_skills", Icon: LayersIcon },
  { key: "workbook", Icon: PencilIcon },
  { key: "planner", Icon: PlannerIcon },
  { key: "merch", Icon: TagIcon },
];
const FILTER_TABS: FilterTab[] = ["all", "pdf", "physical", "bundles", "coming"];

function matchesFilter(p: Product, f: FilterTab) {
  switch (f) {
    case "pdf":
      return p.format.includes("pdf");
    case "physical":
      return p.format.includes("physical");
    case "bundles":
      return p.category === "bundle";
    case "coming":
      return p.is_coming_soon;
    default:
      return true;
  }
}

function matchesQuery(p: Product, q: string) {
  if (!q) return true;
  const hay = [p.title, p.title_en, p.description, p.description_en].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export function BookstoreBrowser({ products, communityHref }: { products: Product[]; communityHref: string | null }) {
  const { m } = useI18n();
  const t = m.bookstore;
  const [collection, setCollection] = useState<CollectionTab>("all");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const browsing = collection !== "all" || filter !== "all" || query.trim() !== "";

  const results = useMemo(
    () =>
      products.filter(
        (p) => (collection === "all" || p.collection === collection) && matchesFilter(p, filter) && matchesQuery(p, query.trim()),
      ),
    [products, collection, filter, query],
  );

  // Default (unfiltered) view follows the sketch: Featured → Popular Bundles → the rest.
  const featured = products.filter((p) => p.is_featured && p.category !== "bundle");
  const bundles = products.filter((p) => p.category === "bundle");
  const more = products.filter((p) => !p.is_featured && p.category !== "bundle");

  return (
    <div className="animate-fade-up">
      <BookstoreHeader
        backHref="/home"
        query={query}
        onQueryChange={setQuery}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
      />

      <h1 className="font-display text-3xl font-semibold md:text-4xl">{t.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t.tagline}</p>

      {/* Hero banner */}
      <section
        style={{ backgroundImage: MESH.violet }}
        className="card-grain relative mt-5 overflow-hidden rounded-card p-6 text-ink shadow-[0_2px_6px_rgb(30_35_64_/_0.08),0_14px_26px_-12px_rgb(118_144_234_/_0.45)] md:p-8"
      >
        <SakuraBranch className="absolute -end-4 -bottom-6 w-44 opacity-90 md:w-60 rtl:-scale-x-100" />
        <p className="relative text-xs font-semibold tracking-[0.18em] text-ink/70 uppercase">{t.hero.kicker}</p>
        <p className="relative mt-2 max-w-[15rem] font-display text-2xl leading-snug font-semibold md:max-w-sm md:text-3xl">
          {t.hero.title}
        </p>
        <a
          href="#catalog"
          className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
        >
          {t.hero.cta}
          <ArrowForwardIcon width={16} height={16} />
        </a>
      </section>

      {/* Category tabs */}
      <nav id="catalog" className="-mx-4 mt-6 scroll-mt-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-3" role="tablist" aria-label={t.title}>
          {COLLECTION_TABS.map(({ key, Icon }) => {
            const active = collection === key;
            return (
              <li key={key}>
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCollection(key)}
                  className="flex w-20 flex-col items-center gap-1.5 text-center"
                >
                  <span
                    className={`grid size-14 place-items-center rounded-2xl border transition ${
                      active ? "border-violet bg-violet text-white" : "border-line bg-surface text-ink-soft hover:text-ink"
                    }`}
                  >
                    <Icon width={24} height={24} />
                  </span>
                  <span className={`text-[11px] leading-tight font-medium ${active ? "text-ink" : "text-ink-soft"}`}>
                    {t.collections[key]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Filter chips */}
      <div className="-mx-4 mt-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2" role="radiogroup" aria-label={t.filters.label}>
          {FILTER_TABS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                role="radio"
                aria-checked={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium whitespace-nowrap transition ${
                  active ? "border-blush bg-blush text-white" : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {t.filters[f]}
              </button>
            );
          })}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-line p-8 text-center text-sm text-ink-soft">{t.emptyCatalog}</p>
      ) : browsing ? (
        <section className="mt-6">
          {results.length === 0 ? (
            <p className="rounded-card border border-dashed border-line p-8 text-center text-sm text-ink-soft">{t.empty}</p>
          ) : (
            <ProductGrid products={results} />
          )}
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <Section title={t.featured}>
              <ProductGrid products={featured} />
            </Section>
          )}
          {bundles.length > 0 && (
            <Section title={t.bundles}>
              <div className="grid gap-4 md:grid-cols-2">
                {bundles.map((p) => (
                  <BundleCard key={p.id} product={p} />
                ))}
              </div>
            </Section>
          )}
          {more.length > 0 && (
            <Section title={t.allProducts}>
              <ProductGrid products={more} />
            </Section>
          )}
        </>
      )}

      {/* Community banner */}
      <section className="mt-10 flex flex-col gap-4 rounded-card bg-gradient-to-br from-sage-soft to-cream-deep p-6 md:flex-row md:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-blush shadow-soft">
          <SparkleIcon width={24} height={24} />
        </span>
        <div className="flex-1">
          <p className="font-display text-xl font-semibold">{t.community.title}</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{t.community.body}</p>
        </div>
        {communityHref && (
          <a
            href={communityHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-deep"
          >
            {t.community.cta}
            <ArrowForwardIcon width={16} height={16} />
          </a>
        )}
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (p.category === "bundle" ? <div key={p.id} className="col-span-2"><BundleCard product={p} /></div> : <ProductCard key={p.id} product={p} />))}
    </div>
  );
}
