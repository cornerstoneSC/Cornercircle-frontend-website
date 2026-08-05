import HeroSection from "@/components/public/Homepage/HeroSection";
import PublicFooter from "@/components/public/layout/PublicFooter";
import PublicHeader from "@/components/public/layout/PublicHeader";
import { heroContent } from "@/data/homepage";

export default function HomepageEditor() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Homepage Editor</h1>

      <section className="overflow-hidden rounded-lg border border-stone-200">
        <div className="pointer-events-none">
          <PublicHeader />
        </div>
        <HeroSection content={heroContent} />
        <div className="pointer-events-none">
          <PublicFooter />
        </div>
      </section>
    </div>
  );
}
