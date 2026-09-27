import { SparkleIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

/** Placeholder for sections designed in the sketches but scheduled for a later phase. */
export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-blush-soft text-danger/70">
        <SparkleIcon width={30} height={30} />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-7 text-ink-soft">
        {description ?? "این بخش به‌زودی اضافه می‌شود."}
      </p>
      <ButtonLink href="/home" variant="secondary" className="mt-8 w-auto! px-8">
        بازگشت به خانه
      </ButtonLink>
    </section>
  );
}
