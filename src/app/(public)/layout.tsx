import PublicFooter from "@/components/public/layout/PublicFooter";
import PublicHeader from "@/components/public/layout/PublicHeader";
import NewsletterSection from "@/components/public/Homepage/NewsletterSection";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <NewsletterSection />
      <PublicFooter />
    </>
  );
}
