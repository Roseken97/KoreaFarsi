import { ComingSoon, placeholderMetadata } from "@/components/shell/ComingSoon";

export const generateMetadata = placeholderMetadata("planner");

export default function Page() {
  return <ComingSoon section="planner" />;
}
