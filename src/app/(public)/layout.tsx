import PublicFooter from "@/components/public/layout/PublicFooter";
import PublicHeader from "@/components/public/layout/PublicHeader";
import NewsletterSection from "@/components/public/Homepage/NewsletterSection";
import { getHomepage } from "@/services/homepage.service";
import type { ReactNode } from "react";
import { servicesPublicEnabled } from "@/lib/services-release";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const servicesEnabled = servicesPublicEnabled();
  let newsletterImageUrl: string | undefined;
  try {
    newsletterImageUrl = (await getHomepage()).newsletterImageUrl;
  } catch {
    // The built-in image remains available if the content API is unavailable.
  }
  return (
    <>
      <PublicHeader servicesEnabled={servicesEnabled} />
      <main className="min-h-screen">{children}</main>
      <NewsletterSection imageUrl={newsletterImageUrl} />
      <PublicFooter servicesEnabled={servicesEnabled} />
    </>
  );
}
