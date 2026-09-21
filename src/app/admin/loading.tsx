export default function AdminLoading() {
  return (
    <section className="grid min-h-full place-items-center bg-[var(--event-canvas)] p-6" aria-busy="true" aria-live="polite">
      <div className="text-center text-sm text-[var(--event-muted)]">
        <span className="mx-auto block h-9 w-9 animate-pulse rounded-full bg-[var(--event-accent-soft)]" />
        <p className="mt-3">Loading admin workspace…</p>
      </div>
    </section>
  );
}
