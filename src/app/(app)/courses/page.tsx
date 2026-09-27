import { ComingSoon, placeholderMetadata } from "@/components/shell/ComingSoon";

export const generateMetadata = placeholderMetadata("courses");

export default function Page() {
  return <ComingSoon section="courses" />;
}
