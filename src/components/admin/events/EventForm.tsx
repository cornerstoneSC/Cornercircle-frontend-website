"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  ImageIcon,
  MapPin,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { FormEvent, useMemo, useState } from "react";

import {
  createAdminEvent,
  publishEvent,
  updateAdminEvent,
  type EventRequestPayload,
} from "@/lib/admin-events-api";

import EventImageUploader from "@/components/admin/events/EventImageUploader";

import type { AdminEvent } from "@/types/admin-event";

interface EventFormProps {
  initialEvent?: AdminEvent;
}

interface Expectation {
  title: string;
  description: string;
}

interface FormState {
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string;

  eventDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;

  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  expectations: Expectation[];

  additionalInformation: string;

  pricePerPerson: string;
  capacity: string;
  registrationDeadline: string;
}

const DEFAULT_EXPECTATION: Expectation = {
  title: "Come Solo or Bring Someone",
  description:
    "Attend on your own or invite a friend—everyone will receive a warm welcome.",
};

function initialExpectations(event?: AdminEvent): Expectation[] {
  const saved = event?.expectations ?? [];
  const alreadyIncluded = saved.some(
    (expectation) =>
      expectation.title.trim().toLowerCase() ===
      DEFAULT_EXPECTATION.title.toLowerCase(),
  );

  return alreadyIncluded ? saved : [...saved, { ...DEFAULT_EXPECTATION }];
}

function createInitialState(event?: AdminEvent): FormState {
  return {
    title: event?.title ?? "",
    category: event?.category ?? "Social gathering",
    shortDescription: event?.shortDescription ?? "",
    description: event?.description ?? "",
    coverImageUrl: event?.coverImageUrl ?? "",

    eventDate: event?.eventDate ?? "",
    startTime: event?.startTime?.slice(0, 5) ?? "",
    endTime: event?.endTime?.slice(0, 5) ?? "",
    timeZone: event?.timeZone ?? "America/Los_Angeles",

    venueName: event?.venueName ?? "",
    address: event?.address ?? "",
    city: event?.city ?? "",
    state: event?.state ?? "CA",
    zipCode: event?.zipCode ?? "",

    expectations: initialExpectations(event),

    additionalInformation: event?.additionalInformation ?? "",

    pricePerPerson:
      event?.pricePerPerson != null ? String(event.pricePerPerson) : "",

    capacity: event?.capacity != null ? String(event.capacity) : "",

    registrationDeadline: event?.registrationDeadline
      ? event.registrationDeadline.slice(0, 16)
      : "",
  };
}

export default function EventForm({ initialEvent }: EventFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(createInitialState(initialEvent));

  const [eventId, setEventId] = useState<number | null>(
    initialEvent?.id ?? null,
  );

  const [slug, setSlug] = useState<string | null>(initialEvent?.slug ?? null);

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isPublished = initialEvent?.publicationStatus === "PUBLISHED";

  const formComplete = useMemo(() => {
    return Boolean(
      form.title.trim() &&
      form.shortDescription.trim() &&
      form.description.trim() &&
      form.coverImageUrl.trim() &&
      form.eventDate &&
      form.startTime &&
      form.endTime &&
      form.venueName.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.state.trim() &&
      form.pricePerPerson !== "" &&
      Number(form.pricePerPerson) >= 0 &&
      form.capacity !== "" &&
      Number(form.capacity) > 0,
    );
  }, [form]);

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExpectation(
    index: number,
    field: keyof Expectation,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      expectations: current.expectations.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  }

  function addExpectation() {
    setForm((current) => ({
      ...current,
      expectations: [
        ...current.expectations,
        {
          title: "",
          description: "",
        },
      ],
    }));
  }

  function removeExpectation(index: number) {
    setForm((current) => ({
      ...current,
      expectations: current.expectations.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function buildSavePayload(): EventRequestPayload {
    const published = initialEvent?.publicationStatus === "PUBLISHED";

    return buildPayload(published ? "publish" : "draft");
  }

  function buildPayload(mode: "draft" | "publish"): EventRequestPayload {
    return {
      title: form.title.trim(),
      category: form.category.trim(),

      shortDescription: form.shortDescription.trim(),

      description: form.description.trim(),

      coverImageUrl: form.coverImageUrl.trim(),

      eventDate: form.eventDate || null,

      startTime: form.startTime || null,

      endTime: form.endTime || null,

      timeZone: form.timeZone,

      venueName: form.venueName.trim(),

      address: form.address.trim(),

      city: form.city.trim(),

      state: form.state.trim(),

      zipCode: form.zipCode.trim(),

      expectations: form.expectations
        .filter((item) => item.title.trim() || item.description.trim())
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
        })),

      additionalInformation: form.additionalInformation.trim(),

      pricePerPerson:
        form.pricePerPerson === "" ? null : Number(form.pricePerPerson),

      capacity: form.capacity === "" ? null : Number(form.capacity),

      registrationDeadline: form.registrationDeadline
        ? `${form.registrationDeadline}:00`
        : null,

      publicationStatus: mode === "publish" ? "PUBLISHED" : "DRAFT",

      visibility: mode === "publish" ? "PUBLIC" : "HIDDEN",
    };
  }

  async function saveDraft() {
    if (!form.title.trim()) {
      setError("Enter an event name before saving the draft.");
      return null;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = buildSavePayload();

      const saved =
        eventId == null
          ? await createAdminEvent(payload)
          : await updateAdminEvent(eventId, payload);

      setEventId(saved.id);
      setSlug(saved.slug);

      setMessage(isPublished ? "Changes saved." : "Draft saved.");

      return saved;
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : isPublished
            ? "Unable to save changes."
            : "Unable to save draft.",
      );

      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await saveDraft();
  }

  async function handlePreview() {
    let id = eventId;

    if (!id) {
      const saved = await saveDraft();

      id = saved?.id ?? null;
    }

    if (!id) {
      return;
    }

    const previewUrl =
      isPublished && slug ? `/events/${slug}` : `/admin/events/${id}/preview`;

    window.open(previewUrl, "_blank", "noopener,noreferrer");
  }

  async function handlePublish() {
    if (!formComplete) {
      setError("Complete all required event information before publishing.");
      return;
    }

    setPublishing(true);
    setError(null);
    setMessage(null);

    try {
      const payload = buildPayload(isPublished ? "publish" : "draft");

      const saved =
        eventId == null
          ? await createAdminEvent(payload)
          : await updateAdminEvent(eventId, payload);

      setEventId(saved.id);
      setSlug(saved.slug);

      if (!isPublished) {
        await publishEvent(saved.id);
      }

      router.push(`/admin/events/${saved.id}`);

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Unable to publish event.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[var(--event-canvas)] pb-24 sm:pb-0"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--event-border)] bg-[var(--event-canvas)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/events"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DED6CD] bg-white text-[#5E5764]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#9A9299]">
                Events
              </p>

              <h1 className="font-serif text-2xl text-[var(--event-heading)]">
                {initialEvent ? "Edit Event" : "Create New Event"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="hidden items-center gap-2 rounded-xl border border-[#D8CDBE] bg-white px-4 py-2.5 text-sm font-medium text-[#625A66] disabled:opacity-50 sm:flex"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : isPublished
                  ? "Save Changes"
                  : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="hidden items-center gap-2 rounded-lg border border-[#CFAE72] px-4 py-2.5 text-sm font-medium text-[#9B6F20] sm:flex"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            {!isPublished && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="hidden rounded-lg bg-[var(--event-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8B651F] disabled:opacity-50 sm:block"
              >
                {publishing ? "Publishing..." : "Publish"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-7 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 xl:grid-cols-[150px_minmax(0,1fr)_300px]">
        <nav className="hidden xl:block" aria-label="Event editor sections">
          <div className="sticky top-28 space-y-1">
            {[
              ["basics", "01", "Basics"],
              ["schedule", "02", "Schedule"],
              ["location", "03", "Location"],
              ["details", "04", "Details"],
              ["registration", "05", "Registration"],
            ].map(([id, number, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  index === 0
                    ? "bg-[var(--event-accent-soft)] font-medium text-[var(--event-accent)]"
                    : "text-[#716B75] hover:bg-white hover:text-[var(--event-accent)]"
                }`}
              >
                <span className="text-xs opacity-70">{number}</span>
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* Form */}
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* EVENT BASICS */}
          <FormSection
            number="01"
            title="Event Basics"
            description="Add the main information visitors will see first."
          >
            <Field label="Event Name" required>
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                placeholder="Summer Mix & Mingle"
                className={inputClass}
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) => setField("category", event.target.value)}
                className={inputClass}
              >
                <option>Social gathering</option>
                <option>Wellness</option>
                <option>Community</option>
                <option>Dining</option>
                <option>Arts &amp; culture</option>
              </select>
            </Field>

            <Field label="Short Description" required>
              <textarea
                value={form.shortDescription}
                onChange={(event) =>
                  setField("shortDescription", event.target.value)
                }
                maxLength={300}
                rows={3}
                placeholder="A short introduction shown on event cards..."
                className={inputClass}
              />

              <p className="mt-1 text-right text-xs text-[#999198]">
                {form.shortDescription.length}
                /300
              </p>
            </Field>

            <Field
              label="Event Cover Image"
              required
              hint="Upload a landscape image for the event."
            >
              <EventImageUploader
                value={form.coverImageUrl}
                onChange={(url) => setField("coverImageUrl", url)}
              />
            </Field>
          </FormSection>

          {/* DATE & TIME */}
          <FormSection
            number="02"
            title="Date & Time"
            description="Choose when the gathering will take place."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Event Date" required>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(event) =>
                    setField("eventDate", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Timezone">
                <select
                  value={form.timeZone}
                  onChange={(event) => setField("timeZone", event.target.value)}
                  className={inputClass}
                >
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </Field>

              <Field label="Start Time" required>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    setField("startTime", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="End Time" required>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(event) => setField("endTime", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* LOCATION */}
          <FormSection
            number="03"
            title="Location"
            description="Tell attendees where the gathering will happen."
          >
            <Field label="Venue Name" required>
              <input
                value={form.venueName}
                onChange={(event) => setField("venueName", event.target.value)}
                placeholder="The Garden Lounge"
                className={inputClass}
              />
            </Field>

            <Field label="Street Address" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#A39BA2]" />

                <input
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  placeholder="123 Santana Row"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <div className="grid gap-5 md:grid-cols-[1fr_120px_140px]">
              <Field label="City" required>
                <input
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                  placeholder="San Jose"
                  className={inputClass}
                />
              </Field>

              <Field label="State" required>
                <input
                  value={form.state}
                  onChange={(event) => setField("state", event.target.value)}
                  placeholder="CA"
                  className={inputClass}
                />
              </Field>

              <Field label="ZIP Code">
                <input
                  value={form.zipCode}
                  onChange={(event) => setField("zipCode", event.target.value)}
                  placeholder="95128"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* EVENT DETAILS */}
          <FormSection
            number="04"
            title="Event Details"
            description="Describe the gathering and what guests should expect."
          >
            <Field label="About This Gathering" required>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                rows={7}
                placeholder="Tell visitors about the gathering..."
                className={inputClass}
              />
            </Field>

            <div>
              <div className="flex items-end justify-between">
                <div>
                  <label className="text-sm font-medium text-[#302B3A]">
                    What to Expect
                  </label>

                  <p className="mt-1 text-xs text-[#8A838C]">
                    Add individual experience highlights.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExpectation}
                  className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-[var(--event-accent)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {form.expectations.map((expectation, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#E7DFD5] bg-[#FCFAF7] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          value={expectation.title}
                          onChange={(event) =>
                            updateExpectation(
                              index,
                              "title",
                              event.target.value,
                            )
                          }
                          placeholder="Meet & Connect"
                          className={inputClass}
                        />

                        <textarea
                          value={expectation.description}
                          onChange={(event) =>
                            updateExpectation(
                              index,
                              "description",
                              event.target.value,
                            )
                          }
                          rows={2}
                          placeholder="Describe this part of the experience..."
                          className={inputClass}
                        />
                      </div>

                      {form.expectations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExpectation(index)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4DDD5] text-[#8C7D7D] hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Field label="Additional Information">
              <textarea
                value={form.additionalInformation}
                onChange={(event) =>
                  setField("additionalInformation", event.target.value)
                }
                rows={5}
                placeholder="Dress code, parking, accessibility, dietary information..."
                className={inputClass}
              />
            </Field>
          </FormSection>

          {/* REGISTRATION */}
          <FormSection
            number="05"
            title="Registration"
            description="Configure pricing, capacity, and the registration deadline."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Price Per Person"
                required
                hint="Enter 0 for a free event."
              >
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-[#77717B]">
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.pricePerPerson}
                    onChange={(event) =>
                      setField("pricePerPerson", event.target.value)
                    }
                    placeholder="35.00"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

              <Field label="Capacity" required>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) => setField("capacity", event.target.value)}
                  placeholder="60"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Registration Deadline">
              <input
                type="datetime-local"
                value={form.registrationDeadline}
                onChange={(event) =>
                  setField("registrationDeadline", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </FormSection>

          {/* Mobile actions */}
          <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-[var(--event-border)] bg-[var(--event-canvas)]/95 p-3 shadow-[0_-8px_28px_rgba(70,40,30,0.08)] backdrop-blur sm:hidden">
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-lg border border-[#D8CDBE] bg-white px-3 py-3 text-sm font-medium text-[#625A66]"
            >
              {isPublished ? "Save Changes" : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="min-h-11 rounded-lg border border-[#CFAE72] px-3 py-3 text-sm font-medium text-[#9B6F20]"
            >
              Preview
            </button>

            {!isPublished && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="min-h-11 rounded-lg bg-[var(--event-accent)] px-3 py-3 text-sm font-medium text-white"
              >
                Publish
              </button>
            )}
          </div>
        </div>

        {/* Right summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-[var(--event-border)] bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--event-accent)]">
              Publish Readiness
            </p>

            {form.coverImageUrl ? (
              <div className="mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-[#EFE9E2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-5 flex aspect-[16/9] items-center justify-center rounded-xl bg-[#F1ECE5]">
                <ImageIcon className="h-7 w-7 text-[#B7ADA3]" />
              </div>
            )}

            <h2 className="mt-5 font-serif text-2xl text-[var(--event-heading)]">
              {form.title || "Your Event Name"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#77717B]">
              {form.shortDescription ||
                "Your short event description will appear here."}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <PreviewItem
                icon={CalendarDays}
                label="Date"
                value={form.eventDate || "Not set"}
              />

              <PreviewItem
                icon={MapPin}
                label="Location"
                value={
                  [form.venueName, form.city, form.state]
                    .filter(Boolean)
                    .join(", ") || "Not set"
                }
              />
            </div>

            <div className="mt-6 border-t border-[#ECE5DC] pt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#999198]">
                Price
              </p>

              <p className="mt-1 font-serif text-2xl text-[var(--event-heading)]">
                {form.pricePerPerson === ""
                  ? "Not set"
                  : Number(form.pricePerPerson) === 0
                    ? "Free"
                    : `$${Number(form.pricePerPerson).toFixed(2)}`}
              </p>
            </div>

            <div
              className={`mt-6 rounded-xl p-4 text-xs leading-5 ${formComplete ? "bg-[#EDF5EC] text-[#52704D]" : "bg-[var(--event-accent-soft)] text-[#9B6F20]"}`}
            >
              {formComplete
                ? "All required information is complete. This event is ready to publish."
                : "Complete the required fields marked with an asterisk before publishing."}
            </div>

            {eventId && slug && (
              <p className="mt-4 break-all text-xs text-[#A09AA1]">
                /events/{slug}
              </p>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#DED7CE] bg-white px-4 py-3 text-sm text-[#302B2F] outline-none transition placeholder:text-[#ACA5AA] focus:border-[var(--event-accent-strong)] focus:ring-2 focus:ring-[var(--event-accent-strong)]/10";

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const sectionId = {
    "01": "basics",
    "02": "schedule",
    "03": "location",
    "04": "details",
    "05": "registration",
  }[number];

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-2xl border border-[var(--event-border)] bg-white"
    >
      <div className="border-b border-[#ECE5DC] px-6 py-5">
        <div className="flex gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--event-accent-soft)] text-xs font-semibold text-[var(--event-accent)]">
            {number}
          </span>

          <div>
            <h2 className="font-serif text-2xl text-[var(--event-heading)]">
              {title}
            </h2>

            <p className="mt-1 text-sm text-[#817A83]">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#302B3A]">
        {label}

        {required && <span className="ml-1 text-[var(--event-accent)]">*</span>}
      </label>

      {hint && <p className="mt-1 text-xs text-[#918A93]">{hint}</p>}

      <div className="mt-2">{children}</div>
    </div>
  );
}

function PreviewItem({
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5EEDF]">
        <Icon className="h-4 w-4 text-[var(--event-accent)]" />
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-[#999198]">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-medium text-[#45404B]">{value}</p>
      </div>
    </div>
  );
}
