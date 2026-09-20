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
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-[#292620] px-4 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0">
        Skip to main content
      </a>
      <PublicHeader servicesEnabled={servicesEnabled} />
      <main id="main-content" tabIndex={-1} className="min-h-screen">{children}</main>
      <NewsletterSection imageUrl={newsletterImageUrl} />
      <PublicFooter servicesEnabled={servicesEnabled} />
    </>
  );
}
