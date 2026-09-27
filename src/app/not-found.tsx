import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p lang="ko" className="text-5xl font-bold text-teal">
          404
        </p>
        <h1 className="mt-4 text-xl font-bold">این صفحه پیدا نشد</h1>
        <ButtonLink href="/home" variant="secondary" className="mt-8 w-auto! px-8">
          رفتن به خانه
        </ButtonLink>
      </div>
    </div>
  );
}
