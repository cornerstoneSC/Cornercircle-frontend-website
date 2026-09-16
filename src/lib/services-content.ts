export type ServicesContent = {
  heroLabel: string; heroTitle: string; heroDescription: string; heroCta: string; howLabel: string;
  heroImage: string; heroAlt: string; gardenImage: string; gardenAlt: string;
  note: string; approachTitle: string; approachDescription: string; stepsTitle: string;
  faqTitle: string; enquiryTitle: string; enquiryDescription: string;
  offerings: { title: string; description: string }[];
  steps: { title: string; text: string }[];
  questions: { question: string; answer: string; items: string[] }[];
};

export const defaultServicesContent: ServicesContent = {
  heroLabel: "Senior companionship",
  heroTitle: "A little company.\nA meaningful\ndifference.",
  heroDescription: "Cornerstone Social Circle offers meaningful companionship for adults age 45+ seeking conversation, connection, and a sense of belonging. Through friendly visits and shared moments, we bring warmth and company to everyday life.",
  heroCta: "Enquire About Companionship", howLabel: "How It Works",
  heroImage: "/images/services/companionship-hero.jpg", heroAlt: "A senior and her companion sharing tea and conversation at home",
  gardenImage: "/images/services/companionship-garden.jpg", gardenAlt: "An older man and his companion enjoying gardening together",
  note: "The little\nmoments matter.", approachTitle: "Time together,\nyour way.",
  approachDescription: "A favourite game. A familiar walk.\nA story worth sharing.\nMeaningful moments begin with\nwhat matters to you.",
  stepsTitle: "Getting\nstarted is\nsimple.", faqTitle: "A few things you may be wondering",
  enquiryTitle: "Let’s make room\nfor connection.", enquiryDescription: "We’re here to help you or your loved one feel more connected, supported and understood.",
  offerings: [
    { title: "Friendly Visits & Conversations", description: "Warm company, shared stories, and meaningful conversation." },
    { title: "Shared Meals & Check-ins", description: "Time together over a meal or a friendly check-in." },
    { title: "Encouragement & Emotional Support", description: "A listening ear and a caring, uplifting presence." },
    { title: "Shared Interests & Light Activities", description: "Enjoying hobbies, games, and gentle activities together." },
  ],
  steps: [
    { title: "Let’s talk", text: "Tell us what you’re looking for and ask any questions." },
    { title: "Get to know each other", text: "We’ll thoughtfully match and connect." },
    { title: "Plan your first visit", text: "We’ll arrange a time that works for you." },
  ],
  questions: [
    { question: "Who is companionship for?", answer: "For adults age 45+", items: ["Seniors experiencing loneliness or isolation", "Older adults who value social connection", "Families seeking companionship support for a loved one", "Seniors who enjoy conversation, presence, and meaningful engagement"] },
    { question: "What can we do together?", answer: "Enjoy a conversation, a favourite game, music, a shared meal or a familiar walk. We can discuss outings and activities that suit your interests and comfort.", items: [] },
    { question: "Where and when are visits available?", answer: "Please include your area and preferred visiting times in your enquiry. We’ll discuss availability with you before arranging a visit.", items: [] },
    { question: "How much does it cost?", answer: "Please enquire to discuss the visits you have in mind and request pricing. We’ll clarify the details before you decide to proceed.", items: [] },
  ],
};

export type CurrentServicesContent = {
  schemaVersion: 2;
  main: { eyebrow: string; title: string; description: string };
  companionship: { eyebrow: string; title: string; description: string; primaryCta: string; secondaryCta: string; hourlyRate: string; minimum: string; startingTotal: string; audience: string[] };
  eventPlanning: { eyebrow: string; title: string; description: string; primaryCta: string; secondaryCta: string };
};

export const defaultCurrentServicesContent: CurrentServicesContent = {
  schemaVersion: 2,
  main: { eyebrow: "A more connected tomorrow", title: "Meaningful companionship.\nMemorable experiences.", description: "Personalized companionship and thoughtfully planned events for individuals, families, retirement homes, and senior communities." },
  companionship: { eyebrow: "Real connections. Brighter days.", title: "Companionship that\nmakes everyday life\nfeel brighter.", description: "Friendly, dependable company tailored to your interests, routines, and preferred pace.", primaryCta: "Book a free 30-minute consultation", secondaryCta: "Explore companionship options", hourlyRate: "$75", minimum: "Two-hour minimum", startingTotal: "Starting total $150", audience: ["Older adults seeking connection and meaningful social interaction", "Families arranging companionship for a loved one", "People wanting company for errands, appointments, or outings", "Retirement-home residents seeking individual engagement"] },
  eventPlanning: { eyebrow: "Events & group experiences", title: "Gatherings that feel\npersonal, joyful, and\nwell cared for.", description: "Thoughtfully planned experiences for retirement homes, senior communities, families, and local groups.", primaryCta: "Book a free 30-minute consultation", secondaryCta: "Explore event options" },
};
