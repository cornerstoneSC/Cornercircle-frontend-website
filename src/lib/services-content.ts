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
  images: { mainHero: string; companionshipCard: string; eventCard: string; companionshipHero: string; eventPlanningHero: string };
  copy: Record<string, string>;
};

export const defaultServicesCopy: Record<string, string> = {
  mainPrimaryCta: "Book a free 30-minute consultation", mainSecondaryCta: "See how it works",
  servicesEyebrow: "Our services", servicesTitle: "How can we help?", servicesIntro: "Two ways to make life richer — the same caring team, the same personal approach.",
  companionshipCardTitle: "Companionship", companionshipCardTagline: "Real connections. Richer days.", companionshipCardDescription: "From shared interests to everyday outings, our team brings warmth, conversation, and joy to daily life.", companionshipCardLink: "Explore companionship",
  eventCardTitle: "Event planning", eventCardTagline: "Meaningful gatherings. Lasting memories.", eventCardDescription: "Let our team handle the details, creating thoughtful experiences for your family, retirement home, or community.", eventCardLink: "Explore event planning",
  processEyebrow: "Our process", processTitle: "From conversation to connection", processIntro: "A simple, clear process for both services.",
  process1Title: "Free consultation", process1Text: "Required before your first booking.", process2Title: "Tell us your needs", process2Text: "Share a few details about your goals, preferences, and schedule.",
  companionshipBranch: "For personal companionship", companionshipStep3Title: "Client approval", companionshipStep3Text: "We’ll match you with the right support and confirm the plan.", companionshipStep4Title: "Book a service", companionshipStep4Text: "Choose your preferred dates and get started.",
  eventBranch: "For events & group experiences", eventStep3Title: "Custom proposal", eventStep3Text: "We’ll create a tailored proposal for your event.", eventStep4Title: "Deposit & confirm", eventStep4Text: "Review, submit a deposit, and we’ll take care of the rest.",
  bottomEyebrow: "Ready when you are", bottomTitle: "A kinder, more connected tomorrow is within reach.", bottomCta: "Book your consultation",
  companionshipOptionsEyebrow: "Companionship options", companionshipOptionsTitle: "Time together, your way.", companionshipOptionsIntro: "Companionship looks different for everyone. Here are some of the ways we can spend time together.",
  option1Title: "Friendly visits", option1Text: "Relaxed conversation, a shared hobby, games, music, or simply friendly company.", option2Title: "Errands & shopping", option2Text: "Friendly accompaniment for groceries, shopping, and everyday errands.", option3Title: "Outings & activities", option3Text: "Walks, cafés, community activities, appointments, and local outings.", option4Title: "Shared meals", option4Text: "Prepare a simple meal, dine together, and enjoy meaningful conversation.", option5Title: "Regular check-ins", option5Text: "Recurring visits that provide connection, encouragement, and consistency.", option6Title: "Family support", option6Text: "Dependable companionship for a loved one when family cannot be present.",
  option1Description: "Friendly visits provide relaxed, one-to-one companionship for older adults who would enjoy more conversation and connection in their week. Each visit follows the person’s interests and preferred pace, whether that means talking over coffee, enjoying music, playing a game, or simply spending comfortable time together.", option1Reason1: "Thoughtfully matched companionship", option1Reason2: "Visits shaped around personal interests", option1Reason3: "Dependable social connection", option1Reason4: "A warm and unhurried approach",
  option2Description: "Errands and shopping support offers friendly accompaniment for everyday tasks outside the home. We can help make grocery trips, picking up essentials, and other planned errands feel easier, more organized, and more enjoyable without taking away the person’s independence.", option2Reason1: "Support that respects independence", option2Reason2: "Patient, unhurried accompaniment", option2Reason3: "Plans tailored to the individual", option2Reason4: "Friendly company along the way",
  option3Description: "Outings and activities help older adults stay engaged with the places and experiences they enjoy. Visits can be planned around a familiar walk, a favourite café, a community activity, or another comfortable local destination.", option3Reason1: "Activities chosen around personal interests", option3Reason2: "Encouragement to stay socially engaged", option3Reason3: "Flexible local plans", option3Reason4: "A familiar companion throughout the outing",
  option4Description: "Shared-meal visits bring company and conversation to a part of the day that can otherwise feel quiet. A companion can help plan or prepare a simple meal, sit down to eat together, and make the experience feel more social and enjoyable.", option4Reason1: "More enjoyable and social mealtimes", option4Reason2: "Simple plans based on preferences", option4Reason3: "Conversation without feeling rushed", option4Reason4: "Respectful support in the home",
  option5Description: "Regular check-ins provide consistent companionship on a schedule that works for the individual. Seeing a familiar face each week can create a reassuring routine, strengthen trust, and offer something meaningful to look forward to.", option5Reason1: "A consistent and familiar companion", option5Reason2: "Visits planned around existing routines", option5Reason3: "Reliable connection throughout the week", option5Reason4: "Clear communication with families",
  option6Description: "Family support provides dependable companionship for a loved one when relatives cannot be present. Visits focus on meaningful engagement, shared activities, and thoughtful communication so families can feel informed and reassured.", option6Reason1: "Dependable support from a trusted team", option6Reason2: "Companionship tailored to your loved one", option6Reason3: "Thoughtful updates and communication", option6Reason4: "Greater reassurance for the whole family",
  audienceEyebrow: "Personalized support", audienceTitle: "Who companionship\nis for", audienceIntro: "Our companionship services are designed for:", audienceQuote: "Life is brighter when it’s shared.", pricingEyebrow: "Simple, transparent pricing", pricingNote: "Recurring and extended visits can be discussed during your consultation.", pricingFootnote: "No obligation. Just a conversation.",
  boundaryTitle: "Companionship, not medical care.", boundaryText: "Cornerstone Social Circle provides non-medical companionship. We do not provide nursing, personal care, medication management, or emergency services.", boundaryFocus: "Our focus is friendship, practical companionship, and meaningful time together — helping you live well and stay connected.",
  companionshipProcessEyebrow: "How it works", companionshipProcessTitle: "A simple process to get started.", companionshipProcess1Title: "Free 30-minute consultation", companionshipProcess1Text: "Required before your first paid visit.", companionshipProcess2Title: "Tell us your needs", companionshipProcess2Text: "We’ll learn about your interests, routines, and preferences.", companionshipProcess3Title: "Client approval", companionshipProcess3Text: "We’ll confirm the details and make sure it’s a good fit.", companionshipProcess4Title: "Book companionship", companionshipProcess4Text: "Once approved, choose your preferred visit dates.",
  eventExperiencesEyebrow: "Designed around your community", eventExperiencesTitle: "What we can plan", eventExperiencesIntro: "Every experience is shaped around your audience, space, goals, accessibility needs, and budget.",
  experience1Title: "Celebrations", experience1Text: "Birthdays, holiday gatherings, appreciation events, and meaningful milestones.", experience2Title: "Creative programs", experience2Text: "Arts, crafts, themed workshops, and hands-on activities designed for the group.", experience3Title: "Social experiences", experience3Text: "Music, tea parties, games, and welcoming opportunities to connect.", experience4Title: "Community outings", experience4Text: "Thoughtfully coordinated local outings with clear logistics and personal attention.",
  experience1Description: "We plan warm, well-organized celebrations that honor the people and moments that matter. From birthdays and holidays to appreciation events and milestones, every detail is shaped around your guests, setting, and vision.", experience1Reason1: "A celebration tailored to your occasion", experience1Reason2: "Thoughtful planning from start to finish", experience1Reason3: "Clear coordination with your team or family", experience1Reason4: "Welcoming details for every guest",
  experience2Description: "Creative programs bring people together through accessible, hands-on experiences. We coordinate the concept, materials, timing, and flow so participants can relax, create, and enjoy meaningful time together.", experience2Reason1: "Programs adapted to the group", experience2Reason2: "Engaging and accessible activities", experience2Reason3: "Materials and logistics thoughtfully arranged", experience2Reason4: "A relaxed, encouraging atmosphere",
  experience3Description: "Social experiences are designed to make connection feel natural and enjoyable. Whether it is music, a tea party, games, or a themed gathering, we create an inviting environment where guests feel comfortable participating.", experience3Reason1: "Experiences built around genuine connection", experience3Reason2: "Flexible themes and formats", experience3Reason3: "A welcoming pace for the group", experience3Reason4: "Attentive on-site coordination",
  experience4Description: "Community outings combine enjoyable local experiences with clear, dependable planning. We help coordinate the destination, schedule, accessibility considerations, and group details for a smoother day out.", experience4Reason1: "Clear plans and communication", experience4Reason2: "Accessibility considered from the start", experience4Reason3: "Schedules shaped around the group", experience4Reason4: "Personal attention throughout the experience",
  eventProcessEyebrow: "A clear planning process", eventProcessTitle: "From idea to memorable experience", eventProcess1Title: "Free consultation", eventProcess1Text: "Tell us about your organization, audience, goals, timing, and budget.", eventProcess2Title: "Custom proposal", eventProcess2Text: "We shape the concept, inclusions, staffing, schedule, and transparent pricing.", eventProcess3Title: "Review & deposit", eventProcess3Text: "Approve the written plan and secure your date with the stated deposit.", eventProcess4Title: "We coordinate", eventProcess4Text: "Our team handles the agreed details and keeps your contact informed.",
  generalConsultEyebrow: "Take the first step", generalConsultTitle: "Start with a conversation.", generalConsultDescription: "A complimentary 30-minute conversation to understand what you’re looking for and explore the right next step together.", generalConsultQuote: "A simple first step toward meaningful support and connection.", generalConsultItem1Title: "Complimentary consultation", generalConsultItem1Text: "No cost, no obligation.", generalConsultItem2Title: "Private & thoughtful", generalConsultItem2Text: "Your information is handled with care.", generalConsultItem3Title: "30 minutes", generalConsultItem3Text: "A focused and meaningful conversation.",
  companionshipConsultEyebrow: "Take the first step", companionshipConsultTitle: "Let’s begin with a conversation.", companionshipConsultDescription: "Tell us what companionship would look like for you or your loved one, and we’ll explore the right next step together.", companionshipConsultQuote: "Meaningful support begins by listening.", companionshipConsultItem1Title: "Complimentary consultation", companionshipConsultItem1Text: "No cost, no obligation.", companionshipConsultItem2Title: "Personal conversation", companionshipConsultItem2Text: "Centered on your interests and routine.", companionshipConsultItem3Title: "30 minutes", companionshipConsultItem3Text: "A focused and meaningful first step.",
  eventConsultEyebrow: "Start here", eventConsultTitle: "Tell us what you are planning.", eventConsultDescription: "Share your goals, audience, timing, and setting so we can prepare for a thoughtful first conversation.", eventConsultQuote: "Every memorable gathering begins with a good conversation.", eventConsultItem1Title: "30-minute consultation", eventConsultItem1Text: "A focused conversation about your event.", eventConsultItem2Title: "Custom proposal", eventConsultItem2Text: "Prepared after we understand your needs.", eventConsultItem3Title: "One caring team", eventConsultItem3Text: "Clear support from planning to delivery.",
  consultationValues: "People • Purpose • Progress",
};

export const defaultCurrentServicesContent: CurrentServicesContent = {
  schemaVersion: 2,
  main: { eyebrow: "A more connected tomorrow", title: "Meaningful companionship.\nMemorable experiences.", description: "Personalized companionship and thoughtfully planned events for individuals, families, retirement homes, and senior communities." },
  companionship: { eyebrow: "Real connections. Brighter days.", title: "Companionship that\nmakes everyday life\nfeel brighter.", description: "Friendly, dependable company tailored to your interests, routines, and preferred pace.", primaryCta: "Book a free 30-minute consultation", secondaryCta: "Explore companionship options", hourlyRate: "$75", minimum: "Two-hour minimum", startingTotal: "Starting total $150", audience: ["Older adults seeking connection and meaningful social interaction", "Families arranging companionship for a loved one", "People wanting company for errands, appointments, or outings", "Retirement-home residents seeking individual engagement"] },
  eventPlanning: { eyebrow: "Events & group experiences", title: "Gatherings that feel\npersonal, joyful, and\nwell cared for.", description: "Thoughtfully planned experiences for retirement homes, senior communities, families, and local groups.", primaryCta: "Book a free 30-minute consultation", secondaryCta: "Explore event options" },
  images: { mainHero: "/images/home/hero.jpg", companionshipCard: "/images/home/companionship-story.jpg", eventCard: "/images/home/hero.jpg", companionshipHero: "/images/services/companionship-hero-banner.png", eventPlanningHero: "/images/services/event-planning-editorial-v3.png" },
  copy: defaultServicesCopy,
};

export function normalizeCurrentServicesContent(value: Partial<CurrentServicesContent> | null | undefined): CurrentServicesContent {
  return {
    ...structuredClone(defaultCurrentServicesContent),
    ...value,
    main: { ...defaultCurrentServicesContent.main, ...(value?.main || {}) },
    companionship: { ...defaultCurrentServicesContent.companionship, ...(value?.companionship || {}), audience: value?.companionship?.audience || defaultCurrentServicesContent.companionship.audience },
    eventPlanning: { ...defaultCurrentServicesContent.eventPlanning, ...(value?.eventPlanning || {}) },
    images: { ...defaultCurrentServicesContent.images, ...(value?.images || {}) },
    copy: { ...defaultServicesCopy, ...(value?.copy || {}) },
    schemaVersion: 2,
  };
}
