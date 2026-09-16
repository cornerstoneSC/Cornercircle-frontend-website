import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EventPlanningDetailsPage from "@/components/public/services/EventPlanningDetailsPage";
import { servicesPublicEnabled } from "@/lib/services-release";
import { getCurrentServicesContent } from "@/services/services-page.service";
import { defaultCurrentServicesContent } from "@/lib/services-content";

export const metadata: Metadata = {
  title: "Events & Group Experiences | Cornerstone Social Circle",
  description: "Thoughtfully planned social experiences for retirement homes, senior communities, families, and community groups.",
};

export default async function EventPlanningPage() {
  if (!servicesPublicEnabled()) redirect("/");
  const content=await getCurrentServicesContent().catch(()=>defaultCurrentServicesContent);
  return <EventPlanningDetailsPage googleBookingUrl={process.env.GOOGLE_APPOINTMENT_SCHEDULE_URL} content={content}/>;
}
