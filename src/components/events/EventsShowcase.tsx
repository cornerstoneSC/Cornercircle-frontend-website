import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";
import { formatEventText, formatEventTime } from "@/lib/event-format";
import styles from "./EventsShowcase.module.css";

type EventsShowcaseProps = { events: Event[] };

function eventDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateParts(value: string) {
  const date = eventDate(value);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(date)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" })
      .format(date)
      .toUpperCase(),
    full: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date),
  };
}

function location(event: Event) {
  return [event.city, event.state].filter(Boolean).join(", ");
}

function fullLocation(event: Event) {
  return [event.venueName, location(event)].filter(Boolean).join(" · ");
}

function price(event: Event) {
  if (event.pricePerPerson === 0) return "Complimentary";
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: event.pricePerPerson % 1 === 0 ? 0 : 2,
  }).format(event.pricePerPerson)} per person`;
}

function registrationClosed(event: Event) {
  return !event.registrationOpen;
}

export default function EventsShowcase({ events }: EventsShowcaseProps) {
  if (!events.length) return null;
  const [featured, ...upcoming] = events;
  const featuredDate = dateParts(featured.eventDate);

  return (
    <section
      className={styles.section}
      aria-label="Upcoming Cornerstone gatherings"
    >
      <div className={styles.inner}>
        <article className={styles.featured}>
          <div className={styles.featuredImage}>
            {featured.coverImageUrl ? (
              <Image
                src={featured.coverImageUrl}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 850px) 100vw, 55vw"
              />
            ) : (
              <div className={styles.imageFallback}>
                <CalendarDays aria-hidden="true" />
              </div>
            )}
            <time
              className={styles.featuredDateBadge}
              dateTime={featured.eventDate}
            >
              <b>{featuredDate.day}</b>
              <span>{featuredDate.month}</span>
            </time>
          </div>
          <div className={styles.featuredCopy}>
            <p className={styles.kicker}>
              <span>Featured event</span>
              <b>Next gathering</b>
            </p>
            <h2>{formatEventText(featured.title)}</h2>
            <div className={styles.meta}>
              <p>
                <CalendarDays aria-hidden="true" />
                {featuredDate.full} · {formatEventTime(featured.startTime)}
              </p>
              <p>
                <MapPin aria-hidden="true" />
                {location(featured)}
              </p>
            </div>
            {featured.shortDescription && (
              <p className={styles.description}>{featured.shortDescription}</p>
            )}
            <div className={styles.mobileMeta}>
              <p>
                <Clock aria-hidden="true" />
                {formatEventTime(featured.startTime)} –{" "}
                {formatEventTime(featured.endTime)}
              </p>
              <p>
                <MapPin aria-hidden="true" />
                {fullLocation(featured)}
              </p>
              <p>
                <Ticket aria-hidden="true" />
                {price(featured)}
              </p>
            </div>
            <p className={styles.capacity}>
              <Users aria-hidden="true" />{" "}
              {featured.registrationOpen
                ? "Limited availability"
                : "Registration closed"}
            </p>
            <Link
              href={`/events/${featured.slug}`}
              className={styles.featuredButton}
            >
              <span>View event</span>
              <b>View event&nbsp;&nbsp; →</b>
            </Link>
          </div>
        </article>

        {upcoming.length > 0 && (
          <>
            <header className={styles.heading}>
              <h2>Upcoming Gatherings</h2>
              <span aria-hidden="true" />
            </header>
            <div className={styles.grid}>
              {upcoming.map((event) => {
                const date = dateParts(event.eventDate);
                const closed = registrationClosed(event);
                return (
                  <article className={styles.card} key={event.id}>
                    <div className={styles.cardImage}>
                      {event.coverImageUrl ? (
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          sizes="(max-width: 700px) 100vw, 33vw"
                        />
                      ) : (
                        <div className={styles.imageFallback}>
                          <CalendarDays aria-hidden="true" />
                        </div>
                      )}
                      <time
                        className={styles.dateBadge}
                        dateTime={event.eventDate}
                      >
                        <span>{date.month}</span>
                        <b>{date.day}</b>
                        <span>{date.weekday}</span>
                      </time>
                    </div>
                    <div className={styles.cardCopy}>
                      <p className={styles.category}>
                        {event.category || "Social gathering"}
                      </p>
                      <h3>{formatEventText(event.title)}</h3>
                      <div className={styles.cardMeta}>
                        <p>
                          <CalendarDays aria-hidden="true" />
                          {date.full} · {formatEventTime(event.startTime)}
                        </p>
                        <p>
                          <MapPin aria-hidden="true" />
                          {location(event)}
                        </p>
                      </div>
                      {event.shortDescription && (
                        <p className={styles.cardDescription}>
                          {event.shortDescription}
                        </p>
                      )}
                      <div className={styles.cardAction}>
                        {closed && <span>Registration closed</span>}
                        <Link href={`/events/${event.slug}`}>
                          {closed ? "View event" : "View details"}{" "}
                          <b aria-hidden="true">→</b>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <aside className={styles.invitation}>
          <span className={styles.botanical} aria-hidden="true">
            ⌇
          </span>
          <div>
            <h2>
              Your next meaningful
              <br />
              connection may begin here.
            </h2>
            <div className={styles.invitationActions}>
              <Link href="/membership">Browse membership</Link>
              <Link href="/contact">Get in touch</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
