import type { Metadata } from "next";
import FounderStory from "@/components/public/founder/FounderStory";
import { defaultHomepageContent } from "@/data/homepage";
import { getHomepage } from "@/services/homepage.service";
import type { HomepageContent } from "@/types/homepage";

export const metadata: Metadata = {
  title: "Dr. Eya Touglo | Cornerstone Social Circle",
  description: "Meet Dr. Eya Touglo, founder of Cornerstone Social Circle.",
};
export default async function FounderPage() {
  let founder = structuredClone(defaultHomepageContent.founder);
  let imageUrl: string | undefined;
  try {
    const homepage = await getHomepage();
    imageUrl = homepage.founderImageUrl;
    if (homepage.contentJson) {
      const saved = JSON.parse(
        homepage.contentJson,
      ) as Partial<HomepageContent>;
      founder = {
        ...founder,
        ...saved.founder,
        biography: saved.founder?.biography ?? founder.biography,
        credentials: saved.founder?.credentials ?? founder.credentials,
        pillars: saved.founder?.pillars ?? founder.pillars,
      };
    }
  } catch {}
  return <FounderStory content={founder} imageUrl={imageUrl} />;
}
