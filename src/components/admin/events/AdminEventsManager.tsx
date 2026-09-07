"use client";

import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { AdminEvent, EventVisibility } from "@/types/admin-event";

import {
  deleteEvent,
  getAllAdminEvents,
  getDraftAdminEvents,
  getPastAdminEvents,
  getUpcomingAdminEvents,
  publishEvent,
  unpublishEvent,
  updateEventVisibility,
} from "@/lib/admin-events-api";

type EventTab = "upcoming" | "past" | "drafts" | "all";

function formatDate(date: string | null) {
  if (!date) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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

function formatPrice(price: number | null) {
  if (price === null) {
    return "Not set";
  }

  if (price === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function AdminEventsManager() {
  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");

  const [events, setEvents] = useState<AdminEvent[]>([]);

  const [allCounts, setAllCounts] = useState({
    upcoming: 0,
    past: 0,
    drafts: 0,
    all: 0,
  });

  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<AdminEvent | null>(null);

  const [actionEventId, setActionEventId] = useState<number | null>(null);

  const [menuEventId, setMenuEventId] = useState<number | null>(null);

  const loadEvents = useCallback(async (tab: EventTab) => {
    setLoading(true);
    setError(null);

    try {
      const [upcoming, past, drafts, all] = await Promise.all([
        getUpcomingAdminEvents(),
        getPastAdminEvents(),
        getDraftAdminEvents(),
        getAllAdminEvents(),
      ]);

      const groups = { upcoming, past, drafts, all };

      setEvents(groups[tab]);
      setAllCounts({
        upcoming: upcoming.length,
        past: past.length,
        drafts: drafts.length,
        all: all.length,
      });
    } catch (err) {
      console.error(err);

      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEvents(activeTab);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeTab, loadEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return events;
    }

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        event.city?.toLowerCase().includes(query) ||
        event.venueName?.toLowerCase().includes(query)
      );
    });
  }, [events, search]);

  async function handleVisibility(event: AdminEvent) {
    if (event.publicationStatus === "DRAFT") {
      return;
    }

    const nextVisibility: EventVisibility =
      event.visibility === "PUBLIC" ? "HIDDEN" : "PUBLIC";

    setActionEventId(event.id);

    try {
      const updated = await updateEventVisibility(event.id, nextVisibility);

      setEvents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );

      if (selectedEvent?.id === updated.id) {
        setSelectedEvent(updated);
      }
    } catch (err) {
      console.error(err);

      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to change event visibility.",
      );
    } finally {
      setActionEventId(null);
    }
  }

  async function handlePublishToggle(event: AdminEvent) {
    setActionEventId(event.id);

    try {
      const updated =
        event.publicationStatus === "DRAFT"
          ? await publishEvent(event.id)
          : await unpublishEvent(event.id);

      await loadEvents(activeTab);

      if (selectedEvent?.id === event.id) {
        setSelectedEvent(updated);
      }
    } catch (err) {
      console.error(err);

      setActionError(
        err instanceof Error
          ? err.message
          : event.publicationStatus === "DRAFT"
            ? "This event cannot be published yet."
            : "Unable to move the event back to drafts.",
      );
    } finally {
      setActionEventId(null);
      setMenuEventId(null);
    }
  }

  async function handleDelete(event: AdminEvent) {
    setActionEventId(event.id);

    try {
      await deleteEvent(event.id);
      setPendingDelete(null);

      if (selectedEvent?.id === event.id) {
        setSelectedEvent(null);
      }

      await loadEvents(activeTab);
    } catch (err) {
      console.error(err);

      setActionError(
        err instanceof Error ? err.message : "Unable to delete this event.",
      );
    } finally {
      setActionEventId(null);
      setMenuEventId(null);
    }
  }

  const tabs: {
    id: EventTab;
    label: string;
    count: number;
  }[] = [
    {
      id: "upcoming",
      label: "Upcoming",
      count: allCounts.upcoming,
    },
    {
      id: "past",
      label: "Past",
      count: allCounts.past,
    },
    {
      id: "drafts",
      label: "Drafts",
      count: allCounts.drafts,
    },
    {
      id: "all",
      label: "All",
      count: allCounts.all,
    },
  ];

  return (
    <div className="min-h-full bg-[var(--event-canvas)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-[var(--event-border)] pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--event-accent)]">
              Community
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[var(--event-heading)]">
              Events
            </h1>

            <p className="mt-2 text-sm text-[#716B75]">
              Plan, publish, and monitor Cornerstone gatherings.
            </p>
          </div>

          <Link
            href="/admin/events/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--event-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8B651F]"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </div>

        {/* Events table card */}
        <section className="mt-6 overflow-visible rounded-2xl border border-[var(--event-border)] bg-white">
          {/* Tabs */}
          <div className="border-b border-[#ECE5DC] px-5">
            <div className="flex gap-7 overflow-x-auto">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex shrink-0 items-center gap-2 py-5 text-sm font-medium ${
                      active ? "text-[var(--event-accent)]" : "text-[#77717B]"
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-[var(--event-accent-soft)] text-[var(--event-accent)]"
                          : "bg-[#F3F1EE] text-[#77717B]"
                      }`}
                    >
                      {loading ? "—" : tab.count}
                    </span>

                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--event-accent-strong)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-4 border-b border-[#ECE5DC] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98919A]" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events..."
                className="h-11 w-full rounded-lg border border-[#DED7CE] bg-[#FCFBF9] pl-10 pr-4 text-sm text-[var(--event-heading)] outline-none transition focus:border-[var(--event-accent-strong)] focus:ring-2 focus:ring-[var(--event-accent-strong)]/10"
              />
            </div>

            <p className="text-sm text-[#8A838C]">
              {loading
                ? "Loading…"
                : `${filteredEvents.length} ${filteredEvents.length === 1 ? "event" : "events"}`}
            </p>
          </div>

          {actionError && (
            <div
              role="alert"
              className="mx-5 mt-5 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{actionError}</span>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="min-h-11 px-2 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="p-14 text-center text-sm text-[#817A83]">
              Loading events...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-14 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => loadEvents(activeTab)}
                className="mt-4 text-sm font-medium text-[var(--event-accent)]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredEvents.length === 0 && (
            <EmptyState tab={activeTab} />
          )}

          {/* Desktop Table */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="divide-y divide-[#EFE9E2] md:hidden">
              {filteredEvents.map((event) => (
                <article key={event.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--event-accent)]">
                        {formatDate(event.eventDate)}
                      </p>
                      <h2 className="mt-1 truncate font-serif text-xl capitalize text-[var(--event-heading)]">
                        {event.title}
                      </h2>
                      <p className="mt-2 text-sm capitalize text-[#716B75]">
                        {[event.venueName, event.city, event.state]
                          .filter(Boolean)
                          .join(", ") || "Location not set"}
                      </p>
                    </div>
                    <PublicationBadge event={event} />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#EEE7DE] pt-4">
                    <span className="text-sm text-[#716B75]">
                      {event.startTime
                        ? formatTime(event.startTime)
                        : "Time not set"}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="inline-flex min-h-11 items-center rounded-lg border border-[#E1D9CF] px-4 text-sm font-medium text-[#5E5764]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        aria-label={`Edit ${event.title}`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--event-accent)] text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Desktop Table */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px]">
                <thead className="bg-[#FCFAF7]">
                  <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-[#918A93]">
                    <th className="px-6 py-4 font-medium">Event</th>

                    <th className="px-5 py-4 font-medium">Date & Time</th>

                    <th className="px-5 py-4 font-medium">Location</th>

                    <th className="px-5 py-4 font-medium">Status</th>

                    <th className="px-5 py-4 font-medium">Capacity</th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFE9E2]">
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="transition hover:bg-[#FCFAF7]"
                    >
                      {/* Event */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EFEAE3]">
                            {event.coverImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.coverImageUrl}
                                alt={event.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <CalendarDays className="h-5 w-5 text-[#B9B0A5]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-serif text-lg capitalize text-[var(--event-heading)]">
                              {event.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5">
                        <p className="text-sm font-medium text-[#383342]">
                          {formatDate(event.eventDate)}
                        </p>

                        {event.startTime && (
                          <p className="mt-1 text-xs text-[#817A83]">
                            {formatTime(event.startTime)}

                            {event.endTime
                              ? ` – ${formatTime(event.endTime)}`
                              : ""}
                          </p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-5">
                        <p className="max-w-[180px] truncate text-sm text-[#514B58]">
                          {event.venueName || "Not set"}
                        </p>

                        {event.city && (
                          <p className="mt-1 text-xs text-[#8A838C]">
                            {event.city}

                            {event.state ? `, ${event.state}` : ""}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        {event.publicationStatus === "DRAFT" ? (
                          <PublicationBadge event={event} />
                        ) : (
                          <button
                            type="button"
                            disabled={actionEventId === event.id}
                            onClick={() => handleVisibility(event)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                              event.visibility === "PUBLIC"
                                ? "bg-[#EDF5EC] text-[#52704D]"
                                : "bg-[#F2F0ED] text-[#807A83]"
                            }`}
                          >
                            {event.visibility === "PUBLIC" ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}

                            {event.visibility === "PUBLIC" ? "Live" : "Hidden"}
                          </button>
                        )}
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#514B58]">
                          <Users className="h-4 w-4 text-[var(--event-accent)]" />

                          <span>{event.capacity ?? "—"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="relative px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="rounded-lg border border-[#E1D9CF] px-3 py-2 text-xs font-medium text-[#5E5764] hover:bg-[#F8F4EE]"
                          >
                            View
                          </Link>

                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="rounded-lg border border-[#E1D9CF] p-2 text-[#5E5764] hover:bg-[#F8F4EE]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setMenuEventId(
                                menuEventId === event.id ? null : event.id,
                              )
                            }
                            className="rounded-lg border border-[#E1D9CF] p-2 text-[#5E5764] hover:bg-[#F8F4EE]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        {menuEventId === event.id && (
                          <div className="absolute right-6 top-[58px] z-30 w-48 rounded-xl border border-[#E5DED5] bg-white p-1.5 shadow-xl">
                            <button
                              type="button"
                              onClick={() => handlePublishToggle(event)}
                              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-[#514B58] hover:bg-[#F8F4EE]"
                            >
                              {event.publicationStatus === "DRAFT"
                                ? "Publish Event"
                                : "Move to Draft"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setPendingDelete(event);
                                setMenuEventId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Event
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Detail drawer */}
      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="w-full max-w-md rounded-2xl border border-[var(--event-border)] bg-white p-6 shadow-2xl"
          >
            <h2
              id="delete-event-title"
              className="font-serif text-2xl text-[var(--event-heading)]"
            >
              Delete event?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#716B75]">
              “{pendingDelete.title}” will be permanently removed. This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-11 rounded-lg border border-[#D8CDBE] px-4 text-sm font-medium text-[#625A66]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(pendingDelete)}
                disabled={actionEventId === pendingDelete.id}
                className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-medium text-white disabled:opacity-50"
              >
                {actionEventId === pendingDelete.id
                  ? "Deleting…"
                  : "Delete Event"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------
   STATUS
-------------------------------------------------- */

function PublicationBadge({ event }: { event: AdminEvent }) {
  if (event.publicationStatus === "DRAFT") {
    return (
      <span className="rounded-full bg-[#F2ECE4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A6A3C]">
        Draft
      </span>
    );
  }

  if (event.visibility === "HIDDEN") {
    return (
      <span className="rounded-full bg-[#F2F0ED] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6E6871]">
        Hidden
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#EDF5EC] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#567050]">
      Live
    </span>
  );
}

/* --------------------------------------------------
   EMPTY STATE
-------------------------------------------------- */

function EmptyState({ tab }: { tab: EventTab }) {
  const content = {
    upcoming: {
      title: "No upcoming events",
      description: "Create a new gathering and publish it to see it here.",
    },

    past: {
      title: "No past events",
      description: "Events will move here automatically after they end.",
    },

    drafts: {
      title: "No drafts",
      description: "Events saved as drafts will appear here.",
    },

    all: {
      title: "No events yet",
      description: "Create your first Cornerstone gathering.",
    },
  }[tab];

  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--event-accent-soft)]">
        <CalendarDays className="h-5 w-5 text-[var(--event-accent)]" />
      </div>

      <h3 className="mt-4 font-serif text-2xl text-[var(--event-heading)]">
        {content.title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817A83]">
        {content.description}
      </p>

      {(tab === "upcoming" || tab === "all") && (
        <Link
          href="/admin/events/new"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--event-accent)] px-5 py-3 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </Link>
      )}
    </div>
  );
}

/* --------------------------------------------------
   EVENT DETAILS DRAWER
-------------------------------------------------- */

function EventDetailsDrawer({
  event,
  onClose,
}: {
  event: AdminEvent;
  onClose: () => void;
}) {
  return (
    <>
      <button
        aria-label="Close event details"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20"
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-[#E6DED5] bg-[#FCFAF7] shadow-2xl sm:max-w-md">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E9E2D9] bg-[#FCFAF7]/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--event-accent)]">
              Event Details
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[var(--event-heading)]">
              {event.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E1D9CF] p-2 text-[#655E68]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {event.coverImageUrl && (
          <div className="relative aspect-[16/8] w-full bg-[#EFEAE3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-8 p-6">
          {/* Controls */}
          <div className="flex gap-3">
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--event-accent)] px-4 py-3 text-sm font-medium text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit Event
            </Link>

            {event.publicationStatus === "PUBLISHED" &&
              event.visibility === "PUBLIC" && (
                <Link
                  href={`/events/${event.slug}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D8C8AC] px-4 py-3 text-sm font-medium text-[#8E661E]"
                >
                  Preview
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
          </div>

          {/* Status */}
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#918A93]">
              Status
            </p>

            <div className="mt-3 flex gap-2">
              <PublicationBadge event={event} />

              <span className="rounded-full bg-[#F1EEE9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6E6871]">
                {event.visibility}
              </span>
            </div>
          </div>

          {/* Event info */}
          <div className="space-y-5">
            <DrawerDetail
              icon={CalendarDays}
              label="Date"
              value={formatDate(event.eventDate)}
            />

            <DrawerDetail
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

            <DrawerDetail
              icon={MapPin}
              label="Location"
              value={
                [event.venueName, event.city, event.state]
                  .filter(Boolean)
                  .join(", ") || "Not set"
              }
            />

            <DrawerDetail
              icon={Users}
              label="Capacity"
              value={event.capacity ? `${event.capacity} spots` : "Not set"}
            />
          </div>

          {/* Description */}
          {event.shortDescription && (
            <div className="border-t border-[#E9E2D9] pt-6">
              <p className="text-xs uppercase tracking-[0.14em] text-[#918A93]">
                About
              </p>

              <p className="mt-3 text-sm leading-7 text-[#665F69]">
                {event.shortDescription}
              </p>
            </div>
          )}

          {/* Registration summary */}
          <div className="border-t border-[#E9E2D9] pt-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#918A93]">
              Registration
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs text-[#8A838C]">Price</p>

                <p className="mt-1 font-serif text-xl text-[var(--event-heading)]">
                  {formatPrice(event.pricePerPerson)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs text-[#8A838C]">Capacity</p>

                <p className="mt-1 font-serif text-xl text-[var(--event-heading)]">
                  {event.capacity ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DrawerDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5EEDF]">
        <Icon className="h-4 w-4 text-[var(--event-accent)]" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-[#938C95]">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#393442]">{value}</p>
      </div>
    </div>
  );
}
