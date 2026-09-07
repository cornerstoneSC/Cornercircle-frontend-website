import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Clock, MapPin, Ticket } from "lucide-react";

import type { Event } from "@/types/event";
import { formatEventTime } from "@/lib/event-format";

interface SingleEventLayoutProps {
  event: Event;
}

function getDateParts(eventDate: string) {
  const [year, month, day] = eventDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    day: String(day).padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(date)
      .toUpperCase(),
  };
}

function formatLocation(event: Event) {
  const cityState = [event.city, event.state].filter(Boolean).join(", ");
  return [event.venueName, cityState].filter(Boolean).join(" · ");
}

function formatPrice(price: number) {
  if (price === 0) return "Complimentary";

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)} per person`;
}

export default function SingleEventLayout({ event }: SingleEventLayoutProps) {
  const date = getDateParts(event.eventDate);

  return (
    <section className="bg-[#f8f5ef] px-5 py-14 sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--event-accent)]">
              Come as you are
            </p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-[var(--event-heading)] md:text-4xl">
              Upcoming Gathering
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden border-b border-[var(--event-accent)] pb-1 text-sm font-medium text-[var(--event-heading)] transition-opacity hover:opacity-70 sm:inline-flex"
          >
            View all events
          </Link>
        </div>

        <article className="group grid overflow-hidden border border-[var(--event-border)] bg-[var(--event-canvas)] lg:grid-cols-[58%_42%]">
          <div className="relative min-h-64 overflow-hidden bg-[var(--event-accent-soft)] sm:min-h-80 lg:min-h-[340px]">
            {event.coverImageUrl ? (
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center px-5 text-center font-serif text-xl text-[var(--event-muted)]">
                Cornerstone Social Circle
              </div>
            )}

            <div className="absolute left-5 top-5 min-w-16 border-t-[3px] border-[var(--event-accent)] bg-white px-2 py-2.5 text-center text-[var(--event-heading)] shadow-sm">
              <span className="block font-serif text-[26px] leading-none">{date.day}</span>
              <span className="mt-1 block text-[9px] font-medium tracking-[0.14em]">{date.month}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center p-7 sm:p-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
              Next gathering
            </p>

            <h3 className="mt-2 font-serif text-3xl font-normal leading-tight text-[var(--event-heading)] sm:text-4xl">
              {event.title}
            </h3>

            {event.shortDescription && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--event-text)]">
                {event.shortDescription}
              </p>
            )}

            <div className="mt-6 space-y-3 text-sm leading-5 text-[var(--event-text)]">
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} />
                <span>{formatEventTime(event.startTime)} – {formatEventTime(event.endTime)}</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} />
                <span>{formatLocation(event)}</span>
              </p>
              <p className="flex items-start gap-3">
                <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} />
                <span>{formatPrice(event.pricePerPerson)}</span>
              </p>
            </div>

            <Link
              href={`/events/${event.slug}`}
              className="mt-7 inline-flex items-center gap-2 self-start bg-[var(--event-heading)] px-5 py-3 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              View gathering <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </article>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            href="/events"
            className="border-b border-[var(--event-accent)] pb-1 text-sm font-medium text-[var(--event-heading)]"
          >
            View all events
          </Link>
        </div>
      </div>
    </section>
  );
}
