import { ComingSoon, placeholderMetadata } from "@/components/shell/ComingSoon";

export const generateMetadata = placeholderMetadata("notifications");

export default function Page() {
  return <ComingSoon section="notifications" />;
}
