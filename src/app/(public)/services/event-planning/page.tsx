import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EventPlanningDetailsPage from "@/components/public/services/EventPlanningDetailsPage";
import { servicesPublicEnabled } from "@/lib/services-release";

export const metadata: Metadata = {
  title: "Events & Group Experiences | Cornerstone Social Circle",
  description: "Thoughtfully planned social experiences for retirement homes, senior communities, families, and community groups.",
};

export default function EventPlanningPage() {
  if (!servicesPublicEnabled()) redirect("/");
  return <EventPlanningDetailsPage googleBookingUrl={process.env.GOOGLE_APPOINTMENT_SCHEDULE_URL} />;
}
