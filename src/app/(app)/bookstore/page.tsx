import { ComingSoon, placeholderMetadata } from "@/components/shell/ComingSoon";

export const generateMetadata = placeholderMetadata("bookstore");

export default function Page() {
  return <ComingSoon section="bookstore" />;
}
