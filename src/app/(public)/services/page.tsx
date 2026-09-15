import type { Metadata } from "next";
import CombinedServicesPage from "@/components/public/services/CombinedServicesPage";

export const metadata: Metadata = {
  title: "Companionship & Event Planning | Cornerstone Social Circle",
  description: "Personal companionship and thoughtfully planned group experiences, beginning with a complimentary 30-minute consultation.",
};

export default function ServicesPage() {
  return <CombinedServicesPage />;
}
