import { ButtonLink } from "@/components/ui/Button";
import { getMessages } from "@/lib/i18n/server";

export default async function NotFound() {
  const { m } = await getMessages();
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-blush">404</p>
        <h1 className="mt-4 text-xl font-semibold">{m.notFound.title}</h1>
        <ButtonLink href="/home" variant="secondary" className="mt-8 w-auto! px-8">
          {m.notFound.cta}
        </ButtonLink>
      </div>
    </div>
  );
}
