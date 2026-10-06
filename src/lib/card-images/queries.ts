import "server-only";
import { getCopyOverrides } from "@/lib/site-copy/queries";
import { CARD_IMAGE_LOCALE, pickCardImages, type CardImages } from "./slots";

/** The uploaded card photos (empty slots keep the plain color card). */
export async function getCardImages(): Promise<CardImages> {
  return pickCardImages(await getCopyOverrides(CARD_IMAGE_LOCALE));
}
