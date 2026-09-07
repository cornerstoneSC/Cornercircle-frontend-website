import AboutHomeSection from "@/components/public/Homepage/AboutHomeSection";
import BeliefsSection from "@/components/public/Homepage/BeliefsSection";
import HeroSection from "@/components/public/Homepage/HeroSection";
import GallerySection from "@/components/public/Homepage/GallerySection";
import FounderSection from "@/components/public/Homepage/FounderSection";
import NewsletterSection from "@/components/public/Homepage/NewsletterSection";
import HomepageEvents from "@/components/public/Homepage/events/HomepageEvents";
import { getHomepage } from "@/services/homepage.service";
import { getHomepageEvents } from "@/lib/events-api";
import {
  defaultHomepageContent,
  updateLegacyFounderIntro,
} from "@/data/homepage";
import type { HomepageContent } from "@/types/homepage";
import type { Event } from "@/types/event";

export default async function HomePage() {
  let content: HomepageContent = structuredClone(defaultHomepageContent);
  let imageUrl = content.hero.imageUrl;
  let aboutImageUrl: string | undefined;
  let beliefsImageUrl: string | undefined;
  let founderImageUrl: string | undefined;

  try {
    const homepage = await getHomepage();
    beliefsImageUrl = homepage.beliefsImageUrl;
    founderImageUrl = homepage.founderImageUrl;
    if (homepage.heroImageUrl) {
      imageUrl = homepage.heroImageUrl;
    }
    if (homepage.contentJson) {
      try {
        const saved = JSON.parse(
          homepage.contentJson,
        ) as Partial<HomepageContent>;
        content = {
          ...content,
          ...saved,
          hero: { ...content.hero, ...saved.hero },
          beliefs: {
            ...content.beliefs,
            ...saved.beliefs,
            items: saved.beliefs?.items ?? content.beliefs.items,
          },
          story: { ...content.story, ...saved.story },
          servicesPreview: {
            ...content.servicesPreview,
            ...saved.servicesPreview,
            services:
              saved.servicesPreview?.services ??
              content.servicesPreview.services,
          },
          gallery: {
            ...content.gallery,
            ...saved.gallery,
            imageAlt: saved.gallery?.imageAlt ?? content.gallery.imageAlt,
          },
          visibility: { ...content.visibility, ...saved.visibility },
          events: { ...content.events, ...saved.events },
          seo: { ...content.seo, ...saved.seo },
          founder: {
            ...content.founder,
            ...saved.founder,
            biography: saved.founder?.biography ?? content.founder.biography,
            credentials:
              saved.founder?.credentials ?? content.founder.credentials,
            pillars: saved.founder?.pillars ?? content.founder.pillars,
          },
        };
        updateLegacyFounderIntro(content);
      } catch {
        console.error("Saved homepage content is invalid; using defaults.");
      }
    }
    if (homepage.aboutImageUrl) {
      aboutImageUrl = homepage.aboutImageUrl;
    }
  } catch (error) {
    console.error("Failed to load homepage data, using fallback", error);
  }

  let events: Event[] = [];
  let eventsUnavailable = false;
  try {
    events = await getHomepageEvents();
  } catch (error) {
    console.error("Unable to load homepage events", error);
    eventsUnavailable = true;
  }

  return (
    <>
      <HeroSection content={{ ...content.hero, imageUrl }} />
      {content.visibility.beliefs && (
        <BeliefsSection content={content.beliefs} imageUrl={beliefsImageUrl} />
      )}
      {content.visibility.story && (
        <AboutHomeSection
          story={content.story}
          servicesPreview={content.servicesPreview}
          imageUrl={aboutImageUrl}
        />
      )}
      {content.visibility.founder && (
        <FounderSection
          content={content.founder}
          imageUrl={founderImageUrl}
        />
      )}
      {content.visibility.gallery && (
        <GallerySection
          content={content.gallery}
          images={[beliefsImageUrl, aboutImageUrl, imageUrl]}
        />
      )}
      {content.visibility.events && (
        <HomepageEvents events={events} unavailable={eventsUnavailable} />
      )}
      <NewsletterSection />
    </>
  );
}
