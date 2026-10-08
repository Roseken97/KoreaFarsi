import type { Metadata } from "next";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  AccountIcon,
  BooksStackIcon,
  DictionaryIcon,
  DownloadIcon,
  HomeIcon,
  LanternIcon,
  LibraryIcon,
  PlannerIcon,
  RobotIcon,
  ShoppingBagIcon,
  TicketIcon,
  TrophyIcon,
} from "@/components/icons";
import { GuideArt } from "@/components/illustrations/GuideArt";
import { SubPageHeader } from "@/components/shell/SubPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { formatNumber, type Messages } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";
import { MESH, MESH_SHADOW } from "@/lib/ui/mesh";

export async function generateMetadata(): Promise<Metadata> {
  const { m } = await getMessages();
  return { title: m.guide.metaTitle };
}

type TopicKey = keyof Messages["guide"]["topics"];

/** In the order a learner meets the app; tone is the icon chip, matching each section's card color. */
const TOPICS: { key: TopicKey; Icon: ComponentType<SVGProps<SVGSVGElement>>; tone: string }[] = [
  { key: "home", Icon: HomeIcon, tone: "bg-blush-soft text-blush" },
  { key: "courses", Icon: BooksStackIcon, tone: "bg-violet-soft text-violet-deep" },
  { key: "bookstore", Icon: ShoppingBagIcon, tone: "bg-clay-soft text-clay-deep" },
  { key: "library", Icon: LibraryIcon, tone: "bg-gold-soft text-gold-deep" },
  { key: "aiHub", Icon: RobotIcon, tone: "bg-indigo-soft text-indigo-deep" },
  { key: "koreaLife", Icon: LanternIcon, tone: "bg-sage-soft text-teal-deep" },
  { key: "planner", Icon: PlannerIcon, tone: "bg-gold-soft text-gold-deep" },
  { key: "dictionary", Icon: DictionaryIcon, tone: "bg-sky-soft text-sky-deep" },
  { key: "achievements", Icon: TrophyIcon, tone: "bg-yellow-soft text-gold-deep" },
  { key: "account", Icon: AccountIcon, tone: "bg-violet-soft text-violet-deep" },
  { key: "install", Icon: DownloadIcon, tone: "bg-sage-soft text-teal-deep" },
];

export default async function GuidePage() {
  const { m, locale } = await getMessages();
  const t = m.guide;

  return (
    <div className="animate-fade-up max-w-lg">
      <SubPageHeader title={t.title} backHref="/account/help" backLabel={m.account.helpPage.title} />
      <p className="-mt-3 mb-6 text-sm leading-6 text-ink-soft">{t.subtitle}</p>

      {/* Quick start */}
      <section
        style={{ backgroundImage: MESH.gold }}
        className={`card-grain overflow-hidden rounded-hero p-5 ${MESH_SHADOW.gold}`}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">{t.quickStart.title}</h2>
          <GuideArt className="-my-2 -me-3 h-24 w-36 shrink-0 drop-shadow-[0_10px_16px_rgb(30_35_64/0.18)]" />
        </div>
        <ol className="mt-3 space-y-3">
          {t.quickStart.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-sm font-bold text-ink shadow-soft">
                {formatNumber(i + 1, locale)}
              </span>
              <span className="pt-0.5 text-sm leading-6 font-medium text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sections of the app */}
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">{t.topicsTitle}</h2>
      <div className="space-y-3">
        {TOPICS.map(({ key, Icon, tone }) => {
          const topic = t.topics[key];
          return (
            <Expandable
              key={key}
              summary={
                <>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                    <Icon width={20} height={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{topic.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-5 text-ink-soft">{topic.summary}</span>
                  </span>
                </>
              }
            >
              <ol className="space-y-2.5">
                {topic.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-6 text-ink">
                    <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${tone}`}>
                      {formatNumber(i + 1, locale)}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-field bg-cream-deep px-3.5 py-2.5 text-[13px] leading-6 text-ink-soft">
                <span className="font-semibold text-ink">{t.tipLabel}: </span>
                {topic.tip}
              </p>
            </Expandable>
          );
        })}
      </div>

      {/* FAQ */}
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">{t.faqTitle}</h2>
      <div className="space-y-3">
        {t.faq.map((item, i) => (
          <Expandable key={i} summary={<span className="flex-1 font-medium text-ink">{item.q}</span>}>
            <p className="text-sm leading-6 text-ink-soft">{item.a}</p>
          </Expandable>
        ))}
      </div>

      {/* Still stuck */}
      <section
        style={{ backgroundImage: MESH.mint }}
        className={`card-grain mt-8 overflow-hidden rounded-hero p-5 ${MESH_SHADOW.mint}`}
      >
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface/80 text-teal-deep shadow-soft">
            <TicketIcon width={24} height={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-semibold text-ink">{t.stillStuck.title}</span>
            <span className="mt-0.5 block text-[13px] leading-5 text-ink">{t.stillStuck.body}</span>
          </span>
        </div>
        <ButtonLink href="/account/help/tickets" className="mt-4 w-full">
          {t.stillStuck.cta}
        </ButtonLink>
      </section>
    </div>
  );
}

/** A card that opens in place to show its steps; native <details>, so it works without JavaScript. */
function Expandable({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="group rounded-card bg-surface shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        {summary}
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="border-t border-line/70 px-4 pt-3.5 pb-4">{children}</div>
    </details>
  );
}
