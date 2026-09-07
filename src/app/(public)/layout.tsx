import PublicFooter from "@/components/public/layout/PublicFooter";
import PublicHeader from "@/components/public/layout/PublicHeader";
import NewsletterSection from "@/components/public/Homepage/NewsletterSection";
import { getHomepage } from "@/services/homepage.service";
import type { ReactNode } from "react";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let newsletterImageUrl: string | undefined;
  try {
    newsletterImageUrl = (await getHomepage()).newsletterImageUrl;
  } catch {
    // The built-in image remains available if the content API is unavailable.
  }
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <NewsletterSection imageUrl={newsletterImageUrl} />
      <PublicFooter />
    </>
  );
}
