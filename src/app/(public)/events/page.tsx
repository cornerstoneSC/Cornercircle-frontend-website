import { getUpcomingEvents } from "@/lib/events-api";
import EventsShowcase from "@/components/events/EventsShowcase";
import EventsHero from "@/components/events/EventsHero";
import NoEvents from "@/components/events/NoEvents";
import type { Event } from "@/types/event";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events | Cornerstone Social Circle",
  description:
    "Discover upcoming Cornerstone Social Circle gatherings created for meaningful conversation, friendship, and connection.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  let events: Event[] = [];
  try {
    events = await getUpcomingEvents();
  } catch (error) {
    console.error("Unable to load events", error);
  }

  return (
    <main className="min-h-screen bg-[var(--event-canvas)]">
      <EventsHero />
      {events.length > 0 ? <EventsShowcase events={events} /> : <NoEvents />}
    </main>
  );
}
