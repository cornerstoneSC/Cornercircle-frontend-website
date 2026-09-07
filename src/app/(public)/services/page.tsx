import type { Metadata } from "next";
import CompanionshipPage from "@/components/public/services/CompanionshipPage";
import { getServicesContent } from "@/services/services-page.service";
import { defaultServicesContent } from "@/lib/services-content";

export const metadata: Metadata = {
  title: "Senior Companionship Services | Cornerstone Social Circle",
  description: "Friendly visits, thoughtful conversation, and shared moments. Discover senior companionship with Cornerstone Social Circle.",
};

export default async function ServicesPage() {
  const content = await getServicesContent().catch(() => defaultServicesContent);
  return <CompanionshipPage content={content} enquiryEmail={process.env.COMPANIONSHIP_ENQUIRY_EMAIL} />;
}
