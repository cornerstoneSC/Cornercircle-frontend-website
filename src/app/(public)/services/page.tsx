import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CombinedServicesPage from "@/components/public/services/CombinedServicesPage";
import { servicesPublicEnabled } from "@/lib/services-release";

export const metadata: Metadata = { title: "Companionship & Event Planning | Cornerstone Social Circle", description: "Personal companionship and thoughtfully planned group experiences, beginning with a complimentary 30-minute consultation." };

export default function ServicesPage() {
  if (!servicesPublicEnabled()) redirect("/");
  return <CombinedServicesPage googleBookingUrl={process.env.GOOGLE_APPOINTMENT_SCHEDULE_URL} />;
}
