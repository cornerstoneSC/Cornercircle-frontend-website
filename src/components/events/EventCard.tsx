import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { formatEventText } from "@/lib/event-format";

interface EventCardProps {
  event: Event;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes));

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7DED8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(70,40,30,0.08)]">
      {/* Event Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F3EFE9]">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CalendarDays className="h-9 w-9 text-[#B8ACA5]" />
          </div>
        )}
      </div>

      {/* Event Information */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
          {formatDate(event.eventDate)}
        </p>

        <h2 className="font-serif text-[26px] capitalize text-[var(--event-heading)]">
          {formatEventText(event.title)}
        </h2>

        {event.shortDescription && (
          <p className="mt-2 min-h-12 line-clamp-2 text-sm leading-6 text-[#6F6974]">
            {event.shortDescription}
          </p>
        )}

        <div className="mt-5 space-y-3 text-sm text-[#575162]">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-[var(--event-accent)]" />
            <span>
              {formatTime(event.startTime)} –{" "}
              {formatTime(event.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-[var(--event-accent)]" />
            <span className="capitalize">
              {[
                event.venueName,
                [event.city, event.state]
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#EEE6E1] pt-4">
          <span className="font-serif text-lg text-[var(--event-heading)]">
            {event.pricePerPerson === 0 ? "Free" : `$${event.pricePerPerson.toFixed(2)}`}
          </span>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-[var(--event-accent)] transition-opacity hover:opacity-70"
          >
            View Event →
          </Link>
        </div>
      </div>
    </article>
  );
}
