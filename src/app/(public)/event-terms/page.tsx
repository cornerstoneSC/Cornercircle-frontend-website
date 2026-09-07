import type { Metadata } from "next";
import Link from "next/link";
import type { EventPolicyContent } from "@/types/event-policy";

export const metadata: Metadata = {
  title: "Event Terms and Cancellation Policy | Cornerstone Social Circle",
  description:
    "Terms, age requirements, and cancellation policy for Cornerstone Social Circle events.",
};

const sections = [
  {
    title: "1. Registration",
    body: [
      "Your place is confirmed after registration and any required payment are successfully completed. Your registration applies only to the event, attendee, and number of guests shown in your confirmation.",
      "You must provide accurate and current registration information. Registrations may not be resold or used for unauthorized commercial purposes.",
    ],
  },
  {
    title: "2. Age requirement",
    body: [
      "Cornerstone Social Circle events are exclusively for adults aged 21 or older. Every attendee and guest must be at least 21 years old on the event date.",
      "We or the venue may request a valid government-issued photo ID. Anyone who cannot verify their age may be refused entry and will not qualify for a refund.",
    ],
  },
  {
    title: "3. Attendee cancellations",
    body: [
      "All event registrations are currently final and non-refundable, including cancellations and no-shows.",
      "If you cannot attend, you may request to transfer your registration to another eligible adult before the event's registration deadline. Transfers are subject to availability and confirmation by Cornerstone Social Circle. The replacement attendee must be at least 21 years old and accept these terms.",
      "To request a transfer, email us with your name, the event name, the email used to register, and the replacement attendee's full name and email address. A transfer is not complete until we confirm it.",
    ],
  },
  {
    title: "4. Cancellation by Cornerstone Social Circle",
    body: [
      "If we cancel an event and do not reschedule it, registered attendees will receive a full refund of the amount paid directly to Cornerstone Social Circle. Refunds will be returned to the original payment method; processing time depends on the bank or payment provider.",
      "We are not responsible for transportation, accommodation, parking, childcare, missed work, or other personal expenses associated with an event.",
    ],
  },
  {
    title: "5. Rescheduled or modified events",
    body: [
      "We may reasonably change an event's date, time, location, venue, schedule, menu, activities, hosts, or other details.",
      "If an event is rescheduled, registrations will normally transfer to the new date. We will notify registered attendees and provide instructions about any available alternatives. Minor changes do not automatically qualify for a refund.",
    ],
  },
  {
    title: "6. Weather and circumstances beyond our control",
    body: [
      "An event may be relocated, delayed, rescheduled, modified, or cancelled because of severe weather, unsafe conditions, venue problems, natural disasters, public emergencies, government restrictions, transportation interruptions, or circumstances outside our reasonable control.",
      "We will notify registered attendees as soon as reasonably possible using the contact information supplied during registration.",
    ],
  },
  {
    title: "7. Guest registrations",
    body: [
      "If you register a guest, you are responsible for confirming that the guest is at least 21, providing accurate guest information, sharing these terms and event details, and explaining our community conduct requirements. Each guest is individually responsible for following these terms.",
    ],
  },
  {
    title: "8. Community conduct",
    body: [
      "Attendees must treat guests, organizers, staff, and venue personnel with dignity and respect. Harassment, discrimination, intimidation, threats, unwanted physical contact, persistent unwanted attention, aggressive or unsafe behavior, excessive intoxication, illegal substances, property damage, disruption, and refusal to follow reasonable instructions are prohibited.",
      "We may refuse admission or remove anyone whose behavior is unsafe, disruptive, or inconsistent with these standards. Removal for misconduct does not qualify for a refund.",
    ],
  },
  {
    title: "9. Food, beverages, and allergies",
    body: [
      "Food and beverages may be prepared or provided by third-party venues, restaurants, caterers, vendors, or attendees. Tell us in advance about dietary restrictions or food allergies.",
      "We will make reasonable efforts to communicate available information but cannot guarantee an allergen-free environment or prevent cross-contact. Each attendee is responsible for deciding whether food or beverages are appropriate for them.",
    ],
  },
  {
    title: "10. Alcohol",
    body: [
      "When alcohol is available, attendees must follow applicable laws and venue requirements. We or the venue may request identification, refuse service, limit consumption, or remove an attendee who creates a safety concern.",
      "Attendees are responsible for drinking responsibly and arranging safe transportation. Never drive while impaired.",
    ],
  },
  {
    title: "11. Accessibility",
    body: [
      "Contact us before the event if you require an accessibility accommodation. We will make reasonable efforts to help, subject to the venue, the event, and the advance notice provided.",
    ],
  },
  {
    title: "12. Health and safety",
    body: [
      "Participation is voluntary. Attendees are responsible for considering their health, comfort, and ability before participating, and must follow venue rules and reasonable safety instructions. If you are unwell or believe attendance could present a risk to others, please do not attend. Contact emergency services immediately in an emergency.",
    ],
  },
  {
    title: "13. Personal belongings and transportation",
    body: [
      "Attendees are responsible for transportation, parking, personal belongings, purchases, conduct, and arrangements before and after the event. We are not responsible for lost, stolen, or damaged property except where responsibility cannot legally be excluded.",
    ],
  },
  {
    title: "14. Photography and recordings",
    body: [
      "We may take photographs or recordings during events for community updates, our website, social media, and promotional purposes. If you prefer not to be included, notify an organizer when you arrive and we will make reasonable efforts to honor your request.",
      "Attendees should respect others' privacy and avoid photographing or recording anyone who has asked not to be included.",
    ],
  },
  {
    title: "15. Event communications",
    body: [
      "By registering, you agree to receive operational messages such as confirmations, reminders, location or schedule changes, safety notices, and cancellation information. These messages are separate from optional newsletter and marketing subscriptions.",
    ],
  },
  {
    title: "16. Personal information",
    body: [
      "We use registration information to process registrations, communicate with attendees, administer events, maintain appropriate records, and provide support. Do not submit unnecessary sensitive medical or financial information through event forms or ordinary email.",
      "Payment information may be processed by a third-party payment provider and is subject to that provider's terms and privacy practices.",
    ],
  },
  {
    title: "17. Future policy changes",
    body: [
      "We may update these terms, including introducing a different refund or event-credit policy. The version accepted when you register governs that registration unless a later change is more favorable, we expressly say it applies, or applicable law requires it.",
    ],
  },
];

const defaultEventPolicy: EventPolicyContent = {
  effectiveDate: "September 6, 2026",
  introduction:
    "These terms apply to events organized by Cornerstone Social Circle. By registering for or attending an event, you agree to these terms.",
  sections,
};

async function getPolicy(): Promise<EventPolicyContent> {
  const backend =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";
  try {
    const response = await fetch(`${backend}/api/v1/event-policy`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok && response.status !== 204) return response.json();
  } catch {}
  return defaultEventPolicy;
}

export default async function EventTermsPage() {
  const policy = await getPolicy();
  return (
    <article className="bg-[#F8F5EF] px-5 py-14 text-[#332D35] sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#A77925]">
          Cornerstone Social Circle
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">
          Event Terms and Cancellation Policy
        </h1>
        <p className="mt-4 text-sm text-[#746D73]">
          Effective {policy.effectiveDate}
        </p>
        <p className="mt-8 border-y border-[#DCCFBE] py-6 leading-7 text-[#554F57]">
          {policy.introduction}
        </p>

        <div className="mt-10 space-y-10">
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-[#2B1D35]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-7 text-[#554F57]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 border border-[#CFAE72] bg-[#FFFDF9] p-6 sm:p-8">
          <h2 className="font-serif text-2xl">18. Contact</h2>
          <p className="mt-3 leading-7 text-[#554F57]">
            Questions, transfer requests, or event-related concerns may be sent
            to{" "}
            <a
              className="font-semibold text-[#8E641F] underline underline-offset-2"
              href="mailto:cornerstonesocialcircle@gmail.com"
            >
              cornerstonesocialcircle@gmail.com
            </a>
            .
          </p>
        </section>

        <Link
          href="/events"
          className="mt-10 inline-flex min-h-12 items-center border border-[#B8892C] px-6 text-sm font-semibold text-[#8E641F]"
        >
          Return to events
        </Link>
      </div>
    </article>
  );
}
