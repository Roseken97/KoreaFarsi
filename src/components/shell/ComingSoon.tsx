import type { Metadata } from "next";
import { SparkleIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import type { Messages } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";

type PlaceholderKey = keyof Messages["placeholders"];

/** Placeholder for sections designed in the sketches but scheduled for a later phase. */
export async function ComingSoon({ section }: { section: PlaceholderKey }) {
  const { m } = await getMessages();
  const { title, body } = m.placeholders[section];

  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-blush-soft text-blush">
        <SparkleIcon width={30} height={30} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{title}</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-7 text-ink-soft">{body || m.common.comingSoon}</p>
      <ButtonLink href="/home" variant="secondary" className="mt-8 w-auto! px-8">
        {m.common.backHome}
      </ButtonLink>
    </section>
  );
}

export function placeholderMetadata(section: PlaceholderKey) {
  return async (): Promise<Metadata> => {
    const { m } = await getMessages();
    return { title: m.placeholders[section].title };
  };
}
