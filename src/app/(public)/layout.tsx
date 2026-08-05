import ComingSoon from "@/components/public/ComingSoon";
import PublicFooter from "@/components/public/layout/PublicFooter";
import PublicHeader from "@/components/public/layout/PublicHeader";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  if (process.env.COMING_SOON === "true") {
    return <ComingSoon />;
  }

  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <PublicFooter />
    </>
  );
}
