export type ContactContent = {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageNote: string;
  formLabel: string;
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
};
