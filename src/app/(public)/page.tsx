import HeroSection from "@/components/public/Homepage/HeroSection";
import { heroContent } from "@/data/homepage";

export default function HomePage() {
  return <HeroSection content={heroContent} />;
}
