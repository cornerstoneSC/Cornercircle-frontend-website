export type HeroContent = {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  titleLineOne: string;
  highlightedText: string;
  titleLineTwo: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
};

export type BeliefContent = { title: string; description: string };

export type BeliefsContent = {
  introduction: string;
  accent: string;
  imageAlt: string;
  statement: string;
  items: BeliefContent[];
};

export type StoryContent = {
  introduction: string;
  accent: string;
  imageAlt: string;
  label: string;
  heading: string;
  description: string;
  learnMoreLabel: string;
  learnMoreCopy: string;
};

export type ServicesPreviewContent = {
  label: string;
  heading: string;
  services: string[];
  buttonLabel: string;
  buttonLink: string;
};

export type GalleryContent = {
  heading: string;
  accent: string;
  description: string;
  imageAlt: string[];
  imageUrls?: string[];
};

export type FounderContent = {
  imageAlt: string;
  eyebrow: string;
  name: string;
  preview: string;
  quote: string;
  buttonLabel: string;
  buttonLink: string;
  storyEyebrow: string;
  storySubtitle: string;
  biography: string[];
  credentialsHeading: string;
  credentials: string[];
  visionHeading: string;
  visionIntroduction: string;
  pillars: Array<{ title: string; description: string }>;
  closingQuote: string;
  eventsButtonLabel: string;
  eventsButtonLink: string;
  membershipButtonLabel: string;
  membershipButtonLink: string;
};

export type HomepageContent = {
  hero: HeroContent;
  beliefs: BeliefsContent;
  story: StoryContent;
  servicesPreview: ServicesPreviewContent;
  gallery: GalleryContent;
  founder: FounderContent;
  visibility: {
    beliefs: boolean;
    story: boolean;
    founder: boolean;
    gallery: boolean;
    events: boolean;
  };
  events: { mode: "automatic" | "selected"; selectedEventIds: number[] };
  seo: { title: string; description: string };
};

export type HighlightItem = {
  icon: "users" | "calendar" | "heart" | "user" | "star";
  title: string;
  description: string;
};
