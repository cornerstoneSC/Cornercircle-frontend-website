import type { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({
  events,
}: EventsGridProps) {
  const layout =
    events.length === 1
      ? "max-w-xl grid-cols-1"
      : events.length === 2
      ? "max-w-5xl grid-cols-1 md:grid-cols-2"
      : "max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`mx-auto grid gap-6 ${layout}`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
