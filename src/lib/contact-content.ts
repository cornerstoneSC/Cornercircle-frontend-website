export type ContactContent = {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageNote: string;
  formLabel: string;
  enquiriesEnabled: boolean;
  openingSoonLabel: string;
  openingSoonTitle: string;
  openingSoonDescription: string;
};

export const defaultContactContent: ContactContent = {
  eyebrow: "Get in touch",
  title: "Let's begin a",
  accentTitle: "conversation.",
  description: "Whether you are curious about an event, membership, companionship, or simply want to say hello, there is a place for your message here.",
  imageUrl: "/images/services/companionship-hero.jpg",
  imageAlt: "Two women enjoying tea and conversation together",
  imageNote: "Connection\nstarts with hello.",
  formLabel: "Write to us",
  enquiriesEnabled: true,
  openingSoonLabel: "Online enquiries are opening soon.",
  openingSoonTitle: "We would still love to hear from you.",
  openingSoonDescription: "For now, send us an email and the Cornerstone Social Circle team will respond as soon as possible.",
};
