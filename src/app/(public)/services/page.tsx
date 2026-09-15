import type { Metadata } from "next";
import ServicesComingSoon from "@/components/public/services/ServicesComingSoon";

export const metadata: Metadata = {
  title: "Coming Soon | Cornerstone Social Circle",
  description: "Our services page is coming soon. Join our newsletter to be notified as soon as it's available.",
};

export default function ServicesPage() {
  return <ServicesComingSoon />;
}
