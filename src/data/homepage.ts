import type {
  HeroContent,
  HighlightItem,
  HomepageContent,
} from "@/types/homepage";

export const highlightItems: HighlightItem[] = [
  {
    icon: "users",
    title: "Meaningful Connections",
    description:
      "Build authentic friendships with like-minded adults who value real conversation and genuine connection.",
  },
  {
    icon: "calendar",
    title: "Quality Gatherings",
    description:
      "Thoughtfully curated events designed to inspire, uplift, and bring our community together.",
  },
  {
    icon: "heart",
    title: "Supportive Community",
    description:
      "A welcoming space where you’re seen, supported, and encouraged to be yourself.",
  },
  {
    icon: "user",
    title: "Personal Growth",
    description:
      "Opportunities to learn, grow, and step into your next chapter with confidence.",
  },
  {
    icon: "star",
    title: "Lasting Friendships",
    description:
      "More than moments—we’re here to build friendships that last a lifetime.",
  },
];

export const heroContent: HeroContent = {
  eyebrow: "A Social Circle With Purpose",
  titleLineOne: "Where",
  highlightedText: "Meaningful",
  titleLineTwo: "Friendships Begin",
  description:
    "Cornerstone Social Circle brings together adults seeking authentic connection, genuine friendship, and meaningful community.",
  primaryButtonText: "View Our Events",
  primaryButtonLink: "/events",
  secondaryButtonText: "Our Story",
  secondaryButtonLink: "/about",
  imageUrl: "/images/home/hero.jpg",
  imageAlt:
    "Adults enjoying conversation and building friendships at a Cornerstone Social Circle gathering",
};

export const defaultHomepageContent: HomepageContent = {
  hero: heroContent,
  beliefs: {
    introduction: "What We Believe",
    accent: "Beliefs that become community.",
    imageAlt: "Friends enjoying time together at a Cornerstone gathering",
    statement: "We don’t just\nshare space—we\nbuild each other up.",
    items: [
      {
        title: "Connection",
        description: "Real conversations.\nLasting relationships.",
      },
      { title: "Belonging", description: "Come as you are.\nYou belong here." },
      {
        title: "Authenticity",
        description: "Be yourself.\nYour real self matters.",
      },
      { title: "Community", description: "Show up together.\nGrow together." },
      {
        title: "Inclusivity",
        description: "Different stories.\nOne place to belong.",
      },
      { title: "Joy", description: "Celebrate life’s\nlittle things." },
    ],
  },
  story: {
    introduction:
      "If you’re looking for meaningful connection\nand a place to truly belong…",
    accent: "You’ve found your circle.",
    imageAlt: "Sharing conversation and companionship over tea",
    label: "Our Story",
    heading: "It started with\na simple idea.",
    description:
      "Cornerstone Social Circle was created to bring people together in welcoming spaces where real connections flourish. From meaningful conversations to shared experiences, our community is here for adults seeking friendship, support, and a true sense of belonging—at every stage of life.",
    learnMoreLabel: "Learn More",
    learnMoreCopy:
      "Through thoughtfully planned experiences, we make it easier to have genuine conversations, discover community, and form relationships that continue long after the event ends.",
  },
  servicesPreview: {
    label: "New Service",
    heading: "Senior\nCompanionship\nService",
    services: [
      "Friendly Visits",
      "Conversation & Connection",
      "Accompanied Outings",
      "Peace of Mind",
    ],
    buttonLabel: "Explore Service",
    buttonLink: "/services",
  },
  gallery: {
    heading: "Cornerstone Is About Creating",
    accent: "Authentic Connections",
    description:
      "Cornerstone Social Circle brings adults together through intentional, in-person gatherings designed to make meeting new people feel natural and welcoming. Through shared experiences, genuine conversations, and joyful moments, friendships begin to grow—and every person has a place to feel seen, supported, and connected.",
    imageAlt: [
      "Friends sharing a joyful conversation at a Cornerstone gathering",
      "A warm moment of friendship and connection",
      "Members enjoying time together",
      "Friends sharing an activity at a community gathering",
      "A candid moment from the Cornerstone Social Circle",
    ],
  },
  founder: {
    imageAlt:
      "Portrait of Dr. Eya Touglo, founder of Cornerstone Social Circle",
    eyebrow: "Welcome",
    name: "Hi, I’m Dr. Eya Touglo",
    preview:
      "Founder of Cornerstone Social Circle, Dr. Touglo brings a background in healthcare administration, nonprofit leadership, community health, education, and senior support. She created CSC to help adults build meaningful friendships and a stronger sense of belonging.",
    quote: "Everyone deserves a place to belong.",
    buttonLabel: "Dr. Touglo’s Story",
    buttonLink: "/founder",
    storyEyebrow: "The Heart Behind CSC",
    storySubtitle: "Founder · Community Builder · Advocate for Connection",
    biography: [
      "Dr. Eya Touglo is the founder of Cornerstone Social Circle (CSC), a community-centered initiative created to bring people together, encourage meaningful friendships, and reduce social isolation and loneliness among adults.",
      "Her professional background spans healthcare, community health, nonprofit leadership, education, executive administration, senior support, community outreach, community collaboration, and partnership development.",
      "Throughout her career, Dr. Touglo has remained passionate about improving quality of life and helping people feel supported, valued, and connected. That passion inspired CSC—a welcoming space where adults and seniors can meet new people, enjoy meaningful conversations, build genuine friendships, and develop a stronger sense of belonging.",
      "Through CSC, Dr. Touglo hopes to create more than social events. Her vision is to build a community where people know they do not have to navigate life alone.",
    ],
    credentialsHeading: "Her Foundation",
    credentials: [
      "Doctorate in Healthcare Administration",
      "Master’s in Nonprofit Leadership and Management",
      "Bachelor’s in Health Communication",
    ],
    visionHeading: "A Vision for Belonging",
    visionIntroduction:
      "CSC is built around the belief that meaningful relationships enrich everyday life and that everyone deserves to feel seen, supported, and connected.",
    pillars: [
      {
        title: "Connection",
        description:
          "Creating space for genuine conversation and supportive relationships.",
      },
      {
        title: "Friendship",
        description:
          "Helping shared experiences grow into lasting, meaningful bonds.",
      },
      {
        title: "Belonging",
        description:
          "Building a community where every person feels welcomed and valued.",
      },
    ],
    closingQuote:
      "Because friendship matters. Friendship changes lives, and everyone deserves a place to belong.",
    eventsButtonLabel: "Explore Upcoming Events",
    eventsButtonLink: "/events",
    membershipButtonLabel: "Become a Member",
    membershipButtonLink: "/membership",
  },
  visibility: {
    beliefs: true,
    story: true,
    founder: true,
    gallery: true,
    events: true,
  },
  events: { mode: "automatic", selectedEventIds: [] },
  seo: {
    title: "Cornerstone Social Circle",
    description:
      "Meaningful friendships, welcoming gatherings, and genuine community.",
  },
};

export function updateLegacyFounderIntro(content: HomepageContent) {
  if (content.founder.eyebrow === "Meet Our Founder") {
    content.founder.eyebrow = "Welcome";
  }
  if (content.founder.name === "Dr. Eya Touglo") {
    content.founder.name = "Hi, I’m Dr. Eya Touglo";
  }
  if (
    content.founder.buttonLabel === "Read Dr. Touglo’s Story" ||
    content.founder.buttonLabel === "Our Story"
  ) {
    content.founder.buttonLabel = "Dr. Touglo’s Story";
  }
  return content;
}
