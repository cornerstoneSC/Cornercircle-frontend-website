import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  CircleParking,
  Clock3,
  Gamepad2,
  Heart,
  HeartHandshake,
  Info,
  MapPin,
  MessageCircle,
  Music2,
  Sparkles,
  Ticket,
  Users,
  Utensils,
} from "lucide-react";

import { getEventBySlug, getUpcomingEvents } from "@/lib/events-api";

import type { Event } from "@/types/event";

import ShareEventButton from "@/components/events/ShareEventButton";
import { formatEventText } from "@/lib/event-format";
import type { Metadata } from "next";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug).catch(() => null);
  if (!event) return { title: "Event Not Found | Cornerstone Social Circle" };
  return {
    title: `${event.title} | Cornerstone Social Circle`,
    description: event.shortDescription,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.shortDescription,
      type: "website",
      images: event.coverImageUrl
        ? [{ url: event.coverImageUrl, alt: event.title }]
        : [],
    },
  };
}

/* ---------------------------------------------
   FORMATTERS
--------------------------------------------- */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTicketBarDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(price: number) {
  if (price === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function fullLocation(event: Event) {
  return [event.venueName, event.city, event.state].filter(Boolean).join(", ");
}

function getMapUrl(event: Event) {
  const query = [
    event.venueName,
    event.address,
    event.city,
    event.state,
    event.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

/* ---------------------------------------------
   PAGE
--------------------------------------------- */

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const upcomingEvents = await getUpcomingEvents();

  const relatedEvents = upcomingEvents
    .filter((item) => item.id !== event.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--event-canvas)] pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        {/* ----------------------------------
            BREADCRUMB
        ---------------------------------- */}

        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#6F6870] lg:mb-9">
          <Link
            href="/"
            className="-mx-2 inline-flex min-h-11 items-center px-2 transition hover:text-[#9B6F20]"
          >
            Home
          </Link>

          <span className="text-[#BBB4B3]">›</span>

          <Link
            href="/events"
            className="-mx-2 inline-flex min-h-11 items-center px-2 transition hover:text-[#9B6F20]"
          >
            Events
          </Link>

          <span className="text-[#BBB4B3]">›</span>

          <span className="text-[#3D383D]">{event.title}</span>
        </nav>

        {/* ----------------------------------
            MAIN LAYOUT
        ---------------------------------- */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          {/* ================================
              LEFT
          ================================= */}

          <div>
            {/* Event intro */}

            <div>
              <span className="inline-flex rounded-md bg-[var(--event-accent-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#9B6F20]">
                Upcoming Event
              </span>

              <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.08] text-[#181518] sm:text-5xl lg:text-[58px]">
                {formatEventText(event.title)}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#555057]">
                {event.shortDescription}
              </p>

              <div className="mt-10 flex flex-col gap-5 border-b border-[#E7DED8] pb-9 sm:flex-row sm:flex-wrap sm:gap-x-8">
                <TopInfo
                  icon={CalendarDays}
                  value={formatDate(event.eventDate)}
                />

                <TopInfo
                  icon={Clock3}
                  value={`${formatTime(event.startTime)} – ${formatTime(
                    event.endTime,
                  )}`}
                />

                <TopInfo
                  icon={MapPin}
                  value={fullLocation(event)}
                  valueClassName="capitalize"
                />
              </div>

              {event.coverImageUrl && (
                <div className="relative mt-8 aspect-[16/8.5] overflow-hidden rounded-[18px] bg-[#EFE8E2] sm:mt-9">
                  <Image
                    src={event.coverImageUrl}
                    alt={`${event.title} event`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover"
                    priority
                  />

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
            </div>

            {/* About */}

            <ContentSection icon={Info} title="About This Gathering">
              <p className="max-w-2xl whitespace-pre-line text-[15px] leading-8 text-[#514B53]">
                {event.description}
              </p>
            </ContentSection>

            {/* Expectations */}

            {event.expectations?.length > 0 && (
              <ContentSection icon={Users} title="What to Expect">
                <div className="space-y-7">
                  {event.expectations.map((expectation, index) => (
                    <ExpectationItem
                      key={`${expectation.title}-${index}`}
                      title={expectation.title}
                      description={expectation.description}
                    />
                  ))}
                </div>
              </ContentSection>
            )}

            {/* Additional information */}

            {event.additionalInformation && (
              <ContentSection icon={Heart} title="Additional Information" last>
                <AdditionalInformation text={event.additionalInformation} />
              </ContentSection>
            )}
          </div>

          {/* ================================
              RIGHT SUMMARY
          ================================= */}

          <aside id="registration" className="scroll-mt-24">
            <div className="rounded-[20px] border border-[var(--event-border)] bg-[#FCF9F6] p-6 shadow-[0_10px_40px_rgba(70,40,30,0.04)] sm:p-7 lg:sticky lg:top-24">
              <h2 className="text-base font-semibold uppercase tracking-[0.03em] text-[#302B2F]">
                Event Summary
              </h2>

              <div className="mt-4 h-[2px] w-16 bg-[var(--event-accent-strong)]" />

              <div className="mt-7 divide-y divide-[#E8DED7]">
                <SummaryRow icon={CalendarDays} label="Date">
                  {formatDate(event.eventDate)}
                </SummaryRow>

                <SummaryRow icon={Clock3} label="Time">
                  <span>
                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                  </span>
                </SummaryRow>

                <SummaryRow icon={MapPin} label="Location">
                  <span className="capitalize">{fullLocation(event)}</span>

                  <a
                    href={getMapUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm font-medium text-[#9B6F20] underline underline-offset-4"
                  >
                    View Map
                  </a>
                </SummaryRow>

                <SummaryRow icon={Ticket} label="Price">
                  {event.pricePerPerson === 0
                    ? "Free"
                    : `${formatPrice(event.pricePerPerson)} per person`}
                </SummaryRow>

                <SummaryRow icon={Users} label="Capacity">
                  Limited availability
                </SummaryRow>

                {event.registrationDeadline && (
                  <SummaryRow icon={CalendarDays} label="Registration Deadline">
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(event.registrationDeadline))}
                  </SummaryRow>
                )}
              </div>

              {event.registrationOpen ? (
                <Link
                  href={`/events/${event.slug}/register`}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B1D35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3A2945] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8892C] focus-visible:ring-offset-2"
                >
                  <Ticket className="h-4 w-4" />
                  Register
                </Link>
              ) : (
                <p className="mt-7 rounded-lg bg-[#EEE8E0] px-5 py-4 text-center text-sm font-semibold text-[#665F65]">
                  Registration closed
                </p>
              )}

              <AddToCalendarButton event={event} />

              <ShareEventButton title={event.title} />

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#817A7E]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#AEA6A5] text-[10px]">
                  ✓
                </span>
                Secure online registration
              </div>
            </div>
          </aside>
        </div>

        {/* ----------------------------------
            RELATED EVENTS
        ---------------------------------- */}

        {relatedEvents.length > 0 && (
          <section className="mt-12 rounded-[20px] border border-[#ECE2DC] bg-[#FFFEFC] px-5 py-8 sm:px-7 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-2xl uppercase tracking-[0.03em] text-[#251F22]">
                You May Also Like
              </h2>

              <div className="mx-auto mt-3 h-[2px] w-10 bg-[var(--event-accent-strong)]" />
            </div>

            <div
              className={`mt-7 grid gap-5 ${
                relatedEvents.length === 1
                  ? "mx-auto max-w-md"
                  : relatedEvents.length === 2
                    ? "mx-auto max-w-4xl md:grid-cols-2"
                    : "md:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {relatedEvents.map((relatedEvent) => (
                <RelatedEventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D9D4CC] bg-[#F8F8F4]/95 px-5 py-4 shadow-[0_-8px_28px_rgba(40,35,30,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0 text-[#171719]">
            <p className="text-[18px] font-bold leading-none">
              {formatPrice(event.pricePerPerson)}
            </p>
            <p className="mt-2 whitespace-nowrap text-[16px] leading-none">
              {formatTicketBarDate(event.eventDate)} at {formatTime(event.startTime)}
            </p>
          </div>

          {event.registrationOpen ? (
            <Link
              href={`/events/${event.slug}/register`}
              className="flex min-h-14 min-w-[clamp(140px,43vw,168px)] shrink-0 items-center justify-center rounded-full bg-[#171719] px-5 text-[17px] font-bold text-white transition hover:bg-[#302D31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8892C] focus-visible:ring-offset-2"
            >
              Get tickets
            </Link>
          ) : (
            <span className="flex min-h-14 min-w-[clamp(140px,43vw,168px)] shrink-0 items-center justify-center rounded-full bg-[#D9D5CF] px-4 text-center text-[14px] font-semibold text-[#66615E]">
              Registration closed
            </span>
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------------------------------------------
   LEFT SECTION COMPONENTS
--------------------------------------------- */

function TopInfo({
  icon: Icon,
  value,
  valueClassName = "",
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#4E484F]">
      <Icon className="h-5 w-5 shrink-0 text-[var(--event-accent)]" />

      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function ContentSection({
  icon: Icon,
  title,
  children,
  last = false,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={`py-9 ${!last ? "border-b border-[#E7DED8]" : ""}`}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--event-accent)] text-white">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-base font-semibold uppercase tracking-[0.02em] text-[#292429]">
          {formatEventText(title)}
        </h2>
      </div>

      <div className="pl-0 sm:pl-9">{children}</div>
    </section>
  );
}

function ExpectationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F5EEE8]">
        <ExpectationIcon value={`${title} ${description}`} />
      </div>

      <div className="pt-1">
        <h3 className="font-serif text-lg font-semibold capitalize text-[#302A2F]">
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-sm leading-6 text-[#514C52]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ExpectationIcon({ value }: { value: string }) {
  const text = value.toLowerCase();
  const className = "h-7 w-7 text-[var(--event-accent)]";
  if (
    /food|meal|dinner|lunch|breakfast|brunch|drink|dessert|sandwich|salad|dining/.test(
      text,
    )
  )
    return <Utensils className={className} />;
  if (/game|trivia|cards|bingo|play/.test(text))
    return <Gamepad2 className={className} />;
  if (/music|dance|sing|concert/.test(text))
    return <Music2 className={className} />;
  if (/conversation|chat|talk|discussion|connect/.test(text))
    return <MessageCircle className={className} />;
  if (/wellness|health|yoga|meditat|fitness|walk/.test(text))
    return <Heart className={className} />;
  if (/accessib|support|assist|accommodation/.test(text))
    return <HeartHandshake className={className} />;
  if (/parking|arrival|transport|location/.test(text))
    return <CircleParking className={className} />;
  if (/activity|activities|creative|craft|art/.test(text))
    return <Sparkles className={className} />;
  return <CheckCircle2 className={className} />;
}

function AdditionalInformation({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•✓✔]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className="max-w-2xl whitespace-pre-line text-sm leading-7 text-[#514C52]">
        {text}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {lines.map((line, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-sm text-[#514C52]"
        >
          <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--event-accent-strong)] text-[9px] font-bold text-[var(--event-accent-strong)]">
            ✓
          </span>

          <span className="leading-5">{line}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------
   SUMMARY
--------------------------------------------- */

function SummaryRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-5 first:pt-0">
      <Icon className="mt-1 h-6 w-6 shrink-0 text-[var(--event-accent)]" />

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#625B60]">
          {label}
        </p>

        <div className="mt-1 text-sm leading-6 text-[#4C464C]">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   CALENDAR
--------------------------------------------- */

function AddToCalendarButton({ event }: { event: Event }) {
  const title = encodeURIComponent(event.title);

  const location = encodeURIComponent(
    [event.venueName, event.address, event.city, event.state, event.zipCode]
      .filter(Boolean)
      .join(", "),
  );

  const description = encodeURIComponent(event.shortDescription);

  const start = `${event.eventDate.replaceAll("-", "")}T${event.startTime
    .slice(0, 5)
    .replace(":", "")}00`;

  const end = `${event.eventDate.replaceAll("-", "")}T${event.endTime
    .slice(0, 5)
    .replace(":", "")}00`;

  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${start}/${end}` +
    `&details=${description}` +
    `&location=${location}`;

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[#CFAE72] bg-transparent px-5 py-3.5 text-sm font-semibold text-[#9B6F20] transition hover:bg-[#F8F4EC]"
    >
      <CalendarDays className="h-4 w-4" />
      Add to Calendar
    </a>
  );
}

/* ---------------------------------------------
   RELATED EVENT CARD
--------------------------------------------- */

function RelatedEventCard({ event }: { event: Event }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#E7DED8] bg-white">
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative aspect-[16/8.5] bg-[#EFE8E2]">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <CalendarDays className="h-8 w-8 text-[#B8ACA5]" />
            </div>
          )}

          <span className="absolute left-3 top-3 rounded bg-[#F9F0EA] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-[#9B6F20]">
            Upcoming
          </span>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-serif text-xl font-semibold capitalize text-[#282227] transition hover:text-[#9B6F20]">
            {formatEventText(event.title)}
          </h3>
        </Link>

        <div className="mt-4 space-y-2 text-xs text-[#625C62]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-[var(--event-accent-strong)]" />

            <span>{formatShortDate(event.eventDate)}</span>

            <Clock3 className="ml-2 h-3.5 w-3.5 text-[var(--event-accent-strong)]" />

            <span>
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[var(--event-accent-strong)]" />

            <span className="capitalize">
              {event.city}
              {event.state ? `, ${event.state}` : ""}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-[#EEE6E1] pt-4">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#9B6F20]"
          >
            View Details
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
