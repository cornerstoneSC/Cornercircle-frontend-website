import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--event-canvas)] px-6">
      <div className="max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--event-accent-strong)]">
          Event Not Found
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[var(--event-heading)]">
          This gathering is no longer available.
        </h1>

        <p className="mt-4 leading-7 text-[#716B75]">
          Explore our upcoming gatherings to find another
          opportunity to connect.
        </p>

        <Link
          href="/events"
          className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-[var(--event-accent)] px-7 py-3 text-sm font-medium text-white"
        >
          View Upcoming Events
        </Link>
      </div>
    </main>
  );
}
