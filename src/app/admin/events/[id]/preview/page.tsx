import { notFound } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, Clock, MapPin, Users } from "lucide-react";

import { getAdminEventServer } from "@/lib/admin-events-server";

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string | null) {
  if (!time) {
    return null;
  }

  const [hours, minutes] = time.split(":");

  const value = new Date();

  value.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminEventPreviewPage({
  params,
}: PreviewPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const event = await getAdminEventServer(numericId);

  return (
    <main className="min-h-screen bg-[var(--event-canvas)] pb-20">
      <div className="border-b border-[var(--event-border)] bg-[var(--event-accent-soft)] px-5 py-3 text-center text-sm font-medium text-[#8A6A3C]">
        Draft preview — this event is not live.
      </div>
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <Link
          href={`/admin/events/${event.id}/edit`}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[#7D747B] hover:text-[var(--event-accent)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Editor
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <section>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[#EFEAE3]">
              {event.coverImageUrl ? (
                <Image
                  src={event.coverImageUrl}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <CalendarDays className="h-10 w-10 text-[#B9B0A5]" />
                </div>
              )}
            </div>

            <h1 className="mt-8 font-serif text-4xl text-[var(--event-heading)]">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="mt-4 text-lg leading-7 text-[#5D5661]">
                {event.shortDescription}
              </p>
            )}

            <div className="mt-8 space-y-5 text-[#45404B]">
              {event.description && (
                <div>
                  <h2 className="font-serif text-2xl text-[var(--event-heading)]">
                    About the Gathering
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7">
                    {event.description}
                  </p>
                </div>
              )}

              {event.expectations.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-[var(--event-heading)]">
                    What to Expect
                  </h2>

                  <ul className="mt-4 space-y-3">
                    {event.expectations.map((expectation) => (
                      <li key={expectation.title} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--event-accent)]" />

                        <div>
                          <p className="font-medium text-[var(--event-heading)]">
                            {expectation.title}
                          </p>

                          {expectation.description && (
                            <p className="mt-1 text-sm text-[#6F6873]">
                              {expectation.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.additionalInformation && (
                <div>
                  <h2 className="font-serif text-2xl text-[var(--event-heading)]">
                    Additional Information
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7">
                    {event.additionalInformation}
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="lg:pt-4">
            <div className="sticky top-28 rounded-3xl border border-[var(--event-border)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--event-accent)]">
                Admin Preview
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[var(--event-heading)]">
                {event.title}
              </h2>

              <div className="mt-6 space-y-4">
                <Summary
                  icon={CalendarDays}
                  label="Date"
                  value={formatDate(event.eventDate) ?? "Not set"}
                />

                <Summary
                  icon={Clock}
                  label="Time"
                  value={
                    event.startTime
                      ? `${formatTime(event.startTime)}${
                          event.endTime ? ` – ${formatTime(event.endTime)}` : ""
                        }`
                      : "Not set"
                  }
                />

                <Summary
                  icon={MapPin}
                  label="Location"
                  value={
                    [event.venueName, event.address, event.city, event.state]
                      .filter(Boolean)
                      .join(", ") || "Not set"
                  }
                />

                <Summary
                  icon={Users}
                  label="Capacity"
                  value={event.capacity ? `${event.capacity} spots` : "Not set"}
                />

                <Summary
                  label="Price"
                  value={
                    event.pricePerPerson == null
                      ? "Not set"
                      : event.pricePerPerson === 0
                        ? "Free"
                        : `$${event.pricePerPerson.toFixed(2)}`
                  }
                />
              </div>

              <a
                href={`/events/${event.slug}/register`}
                className="mt-7 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#2B1D35] py-3 text-sm font-medium text-white transition hover:bg-[#3A2945]"
              >
                Register
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-[#EEE8E0] pb-4 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5EEDF]">
            <Icon className="h-4 w-4 text-[var(--event-accent)]" />
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#9A939A]">
            {label}
          </p>

          <p className="mt-1 font-medium text-[#393442]">
            {value || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}
