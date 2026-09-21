import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CompanionshipDetailsPage from "@/components/public/services/CompanionshipDetailsPage";
import { servicesPublicEnabled } from "@/lib/services-release";
import { getCurrentServicesContent } from "@/services/services-page.service";
import { defaultCurrentServicesContent } from "@/lib/services-content";

export const metadata: Metadata = { title: "Personal Companionship", description: "Friendly visits, errands, outings, shared activities, and dependable companionship tailored to your interests and routine." };

export default async function CompanionshipPage() {
  if (!servicesPublicEnabled()) redirect("/");
  const content=await getCurrentServicesContent().catch(()=>defaultCurrentServicesContent);
  return <CompanionshipDetailsPage googleBookingUrl={process.env.GOOGLE_APPOINTMENT_SCHEDULE_URL} content={content}/>;
}
