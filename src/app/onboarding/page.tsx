import { getMessages } from "@/lib/i18n/server";
import { getOnboardingSlides } from "@/lib/onboarding-slides/queries";
import { OnboardingCarousel } from "./OnboardingCarousel";

/** First-run carousel. Slides (photo + text) come from /admin/onboarding, or the code defaults. */
export default async function OnboardingPage() {
  const { locale } = await getMessages();
  const slides = await getOnboardingSlides(locale);
  return <OnboardingCarousel slides={slides} />;
}
