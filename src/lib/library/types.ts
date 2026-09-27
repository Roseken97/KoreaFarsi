import type { Product } from "@/lib/bookstore/types";

/** A row from user_library, joined with its product. */
export type LibraryEntry = {
  id: string;
  granted_at: string;
  source: "purchase_request" | "manual";
  product: Product;
};
