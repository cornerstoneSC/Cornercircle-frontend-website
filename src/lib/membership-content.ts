export type MembershipContent = {
  annualPriceCents: number;
  eyebrow: string;
  title: string;
  price: string;
  pricePeriod: string;
  tagline: string;
  benefits: string[];
  stepLabels: string[];
  stepOneTitle: string;
  stepOneIntro: string;
  stepTwoTitle: string;
  stepTwoIntro: string;
  stepThreeTitle: string;
  stepThreeIntro: string;
  activitiesLegend: string;
  activities: string[];
  goalsLegend: string;
  goals: string[];
  agreementTitle: string;
  agreementText: string;
  photographyTitle: string;
  photographyParagraphs: string[];
  photographyAcknowledgement: string;
  commentsLabel: string;
};

export const defaultMembershipContent: MembershipContent = {
  annualPriceCents: 19900,
  eyebrow: "Cornerstone Social Circle",
  title: "Annual Membership",
  price: "$199",
  pricePeriod: "/ year",
  tagline: "A place for friendship to grow.",
  benefits: [
    "Priority registration",
    "Preferred member event pricing",
    "Members-only gatherings",
    "Guest & referral benefits",
    "Community updates & celebrations",
    "Coffee or tea with the founder",
  ],
  stepLabels: ["You", "Interests", "Agreement"],
  stepOneTitle: "Your membership begins here.",
  stepOneIntro: "Tell us a little about yourself.",
  stepTwoTitle: "What brings you joy?",
  stepTwoIntro: "Choose all that feel like you.",
  stepThreeTitle: "A community built on care.",
  stepThreeIntro: "A few shared commitments before you join.",
  activitiesLegend: "Activities that interest you",
  activities: ["Social breakfasts", "Social lunches & dinners", "Coffee or tea gatherings", "Wellness events", "Book discussions", "Networking events", "Volunteer opportunities", "Outdoor activities"],
  goalsLegend: "What are you hoping to gain?",
  goals: ["New friendships", "Social confidence", "A stronger community", "Professional connections", "Personal growth", "A wider social circle", "Fun and laughter", "A sense of belonging", "Encouragement and motivation", "A healthier, more connected lifestyle"],
  agreementTitle: "Membership agreement",
  agreementText: "By joining CSC, I agree to help foster respectful, authentic, and meaningful friendships; treat members with kindness, respect, and professionalism; understand that some gatherings may have limited capacity; and follow CSC's Code of Conduct.",
  photographyTitle: "Event photography notice",
  photographyParagraphs: [
    "Cornerstone Social Circle photographs and records moments from its gatherings to celebrate our community and share CSC through its website, social media, newsletters, and promotional materials.",
    "By attending CSC events, you understand that you may appear in photographs or videos. We thoughtfully select respectful and appropriate images for publication. If you have a concern about a particular published image, please contact us, and we will make reasonable efforts to address your request.",
  ],
  photographyAcknowledgement: "I have read and understand the Event Photography Notice.",
  commentsLabel: "Other comments (optional)",
};
