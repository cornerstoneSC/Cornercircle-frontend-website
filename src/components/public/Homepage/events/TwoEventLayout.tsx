import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Clock, MapPin, Ticket } from "lucide-react";

import type { Event } from "@/types/event";
import { formatEventTime } from "@/lib/event-format";

interface TwoEventLayoutProps { events: Event[]; }

function getDateParts(eventDate: string) {
  const [year, month, day] = eventDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    day: String(day).padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date).toUpperCase(),
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

export default function TwoEventLayout({ events }: TwoEventLayoutProps) {
  return (
    <section className="bg-[#f8f5ef] px-5 py-14 sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--event-accent)]">Come as you are</p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-[var(--event-heading)] md:text-4xl">Upcoming Gatherings</h2>
          </div>
          <Link href="/events" className="hidden border-b border-[var(--event-accent)] pb-1 text-sm font-medium text-[var(--event-heading)] transition-opacity hover:opacity-70 sm:inline-flex">
            View all events
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {events.slice(0, 2).map((event, index) => {
            const date = getDateParts(event.eventDate);

            return (
              <article key={event.id} className="group grid overflow-hidden border border-[var(--event-border)] bg-[var(--event-canvas)] sm:grid-cols-[42%_58%]">
                <div className="relative min-h-52 overflow-hidden bg-[var(--event-accent-soft)] sm:min-h-72">
                  {event.coverImageUrl ? (
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 22vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-5 text-center font-serif text-lg text-[var(--event-muted)]">Cornerstone Social Circle</div>
                  )}
                  <div className="absolute left-4 top-4 min-w-14 border-t-[3px] border-[var(--event-accent)] bg-white px-2 py-2 text-center text-[var(--event-heading)] shadow-sm">
                    <span className="block font-serif text-2xl leading-none">{date.day}</span>
                    <span className="mt-1 block text-[9px] font-medium tracking-[0.14em]">{date.month}</span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col justify-center p-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">{index === 0 ? "Next gathering" : "Upcoming event"}</p>
                  <h3 className="mt-2 font-serif text-2xl font-normal leading-tight text-[var(--event-heading)]">{event.title}</h3>
                  <div className="mt-5 space-y-2.5 text-xs leading-5 text-[var(--event-text)]">
                    <p className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} /><span>{formatEventTime(event.startTime)} – {formatEventTime(event.endTime)}</span></p>
                    <p className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} /><span>{formatLocation(event)}</span></p>
                    <p className="flex items-start gap-2.5"><Ticket className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent)]" strokeWidth={1.7} /><span>{formatPrice(event.pricePerPerson)}</span></p>
                  </div>
                  <Link href={`/events/${event.slug}`} className="mt-5 inline-flex items-center gap-2 self-start text-xs font-medium text-[var(--event-heading)] transition-colors hover:text-[var(--event-accent)]">
                    View gathering <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link href="/events" className="border-b border-[var(--event-accent)] pb-1 text-sm font-medium text-[var(--event-heading)]">View all events</Link>
        </div>
      </div>
    </section>
  );
}
