import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CompanionshipDetailsPage from "@/components/public/services/CompanionshipDetailsPage";
import { servicesPublicEnabled } from "@/lib/services-release";

export const metadata: Metadata = { title: "Personal Companionship | Cornerstone Social Circle", description: "Friendly visits, errands, outings, shared activities, and dependable companionship tailored to your interests and routine." };

export default function CompanionshipPage() {
  if (!servicesPublicEnabled()) redirect("/");
  return <CompanionshipDetailsPage googleBookingUrl={process.env.GOOGLE_APPOINTMENT_SCHEDULE_URL} />;
}
