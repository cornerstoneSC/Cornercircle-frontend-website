import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Pencil,
  Ticket,
  Users,
} from "lucide-react";

import { getAdminEventServer } from "@/lib/admin-events-server";

interface EventOverviewPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value: string | null) {
  if (!value) return "Date not set";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string | null) {
  if (!value) return "Not set";

  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatPrice(value: number | null) {
  if (value == null) return "Not set";
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function EventOverviewPage({
  params,
}: EventOverviewPageProps) {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) notFound();

  const event = await getAdminEventServer(eventId).catch(() => null);
  if (!event) notFound();

  const isLive =
    event.publicationStatus === "PUBLISHED" && event.visibility === "PUBLIC";

  const status =
    event.publicationStatus === "DRAFT"
      ? "Draft"
      : event.visibility === "HIDDEN"
        ? "Hidden"
        : "Live";

  const totalCapacity = event.capacity ?? 0;
  const remainingCapacity = event.remainingCapacity ?? 0;
  const reservedCapacity = Math.max(0, totalCapacity - remainingCapacity);
  const reservedPercentage = totalCapacity
    ? Math.min(100, Math.max(0, (reservedCapacity / totalCapacity) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-[var(--event-canvas)] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/events"
              aria-label="Back to events"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DED6CD] bg-white text-[#5E5764]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl text-[var(--event-heading)]">
                  {event.title}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isLive
                      ? "bg-[#EDF5EC] text-[#52704D]"
                      : "bg-[var(--event-accent-soft)] text-[#9B6F20]"
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#7A737A]">
                Event overview and publication status
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isLive && (
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#CFAE72] px-4 py-2.5 text-sm font-medium text-[#9B6F20]"
              >
                <ExternalLink className="h-4 w-4" />
                View Live
              </Link>
            )}
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--event-accent)] px-4 py-2.5 text-sm font-medium text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit Event
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section>
            <div className="relative aspect-[16/8] overflow-hidden rounded-[20px] bg-[#EFE8E2]">
              {event.coverImageUrl ? (
                <Image
                  src={event.coverImageUrl}
                  alt={`${event.title} event`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <CalendarDays className="h-10 w-10 text-[#B8ACA5]" />
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--event-border)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
                Public Summary
              </p>
              <h2 className="mt-3 font-serif text-2xl text-[var(--event-heading)]">
                {event.shortDescription || "No short description yet."}
              </h2>
              <div className="mt-5 grid gap-4 border-t border-[#ECE2DC] pt-5 sm:grid-cols-3">
                <OverviewItem
                  icon={CalendarDays}
                  label="Date"
                  value={formatDate(event.eventDate)}
                />
                <OverviewItem
                  icon={Clock3}
                  label="Time"
                  value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                />
                <OverviewItem
                  icon={MapPin}
                  label="Location"
                  value={
                    [event.venueName, event.city, event.state]
                      .filter(Boolean)
                      .join(", ") || "Not set"
                  }
                />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <DetailSection title="About this gathering">
                <p className="whitespace-pre-line text-sm leading-7 text-[#514B53]">
                  {event.description || "No full description has been added."}
                </p>
              </DetailSection>

              <DetailSection title="Location and schedule">
                <dl className="grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
                  <DetailItem
                    label="Category"
                    value={event.category || "Social gathering"}
                  />
                  <DetailItem
                    label="Date"
                    value={formatDate(event.eventDate)}
                  />
                  <DetailItem
                    label="Time"
                    value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                  />
                  <DetailItem
                    label="Time zone"
                    value={event.timeZone || "America/Los_Angeles"}
                  />
                  <DetailItem
                    label="Venue"
                    value={event.venueName || "Not set"}
                  />
                  <DetailItem
                    label="Full address"
                    value={
                      [event.address, event.city, event.state, event.zipCode]
                        .filter(Boolean)
                        .join(", ") || "Not set"
                    }
                  />
                </dl>
              </DetailSection>

              <DetailSection title="What to expect">
                {event.expectations.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.expectations.map((expectation, index) => (
                      <article
                        key={`${expectation.title}-${index}`}
                        className="rounded-xl border border-[#E8E0D7] bg-[#FCFAF7] p-4"
                      >
                        <h3 className="font-medium text-[var(--event-heading)]">
                          {expectation.title || `Expectation ${index + 1}`}
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#625B60]">
                          {expectation.description || "No description."}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#817A7E]">
                    No expectations have been added.
                  </p>
                )}
              </DetailSection>

              <DetailSection title="Additional information">
                <p className="whitespace-pre-line text-sm leading-7 text-[#514B53]">
                  {event.additionalInformation ||
                    "No additional information has been added."}
                </p>
              </DetailSection>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[var(--event-border)] bg-[#FCF9F6] p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
                Registration
              </p>
              <div className="mt-5 border-b border-[#E8DED7] pb-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#817A7E]">Tickets remaining</p>
                    <p className="mt-1 font-serif text-4xl leading-none text-[var(--event-heading)]">
                      {event.remainingCapacity ?? "—"}
                    </p>
                  </div>
                  <Users className="h-6 w-6 text-[var(--event-accent)]" />
                </div>

                {event.capacity != null && (
                  <div className="mt-5">
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-[#E8DED7]"
                      role="progressbar"
                      aria-label="Tickets reserved"
                      aria-valuemin={0}
                      aria-valuemax={event.capacity}
                      aria-valuenow={reservedCapacity}
                    >
                      <div
                        className="h-full rounded-full bg-[var(--event-accent)] transition-[width]"
                        style={{ width: `${reservedPercentage}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between gap-3 text-xs text-[#817A7E]">
                      <span>{remainingCapacity} available</span>
                      <span>
                        {reservedCapacity} reserved · {totalCapacity} total
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <DetailItem
                  label="Price per person"
                  value={formatPrice(event.pricePerPerson)}
                />
                <DetailItem
                  label="Registration deadline"
                  value={formatDateTime(event.registrationDeadline)}
                />
              </dl>
              <Link
                href={`/admin/event-registrations?event=${encodeURIComponent(event.slug)}`}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#CFAE72] px-4 text-sm font-medium text-[#9B6F20]"
              >
                <Ticket className="h-4 w-4" /> View registrations
              </Link>
            </div>

            <div className="rounded-2xl border border-[var(--event-border)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
                Activity
              </p>
              <div className="mt-4 space-y-4 text-sm text-[#625B60]">
                <p>
                  Created{" "}
                  {new Date(event.createdAt).toLocaleDateString("en-US")}
                </p>
                <p>
                  Updated{" "}
                  {new Date(event.updatedAt).toLocaleDateString("en-US")}
                </p>
                <p>Visibility: {event.visibility.toLowerCase()}</p>
                <p>Publication: {event.publicationStatus.toLowerCase()}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--event-border)] bg-white p-6">
      <h2 className="font-serif text-2xl text-[var(--event-heading)]">
        {title}
      </h2>
      <div className="mt-4 border-t border-[#ECE2DC] pt-5">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#817A7E]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-[#4C464C]">{value}</dd>
    </div>
  );
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--event-accent)]" />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#817A7E]">
          {label}
        </p>
        <p className="mt-1 text-sm capitalize text-[#4C464C]">{value}</p>
      </div>
    </div>
  );
}
