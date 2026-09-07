import type { Event } from "@/types/event";

import SingleEventLayout from "./SingleEventLayout";
import TwoEventLayout from "./TwoEventLayout";
import ThreeEventLayout from "./ThreeEventLayout";

interface HomepageEventsProps {
  events: Event[];
  unavailable?: boolean;
}

export default function HomepageEvents({
  events,
  unavailable = false,
}: HomepageEventsProps) {
  if (unavailable) {
    return (
      <section className="bg-[#f8f5ef] px-6 py-14 text-center" aria-label="Upcoming events">
        <h2 className="text-2xl font-medium text-[#272220]">Upcoming events</h2>
        <p role="status" className="mt-3 text-sm text-[#675f5a]">
          Events are temporarily unavailable. Please refresh the page to try again.
        </p>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  // One upcoming event
  if (events.length === 1) {
    return (
      <SingleEventLayout
        event={events[0]}
      />
    );
  }

  // Two upcoming events
  if (events.length === 2) {
    return (
      <TwoEventLayout
        events={events}
      />
    );
  }

  // Three or more upcoming events
  return (
    <ThreeEventLayout
      events={events.slice(0, 3)}
    />
  );
}
