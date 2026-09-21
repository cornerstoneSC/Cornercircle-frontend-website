"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-full place-items-center bg-[var(--event-canvas)] p-6">
      <div className="w-full max-w-xl rounded-[var(--event-radius-md)] border border-[var(--event-border)] bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--event-danger)]">
          Admin workspace
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--event-heading)]">
          This page could not be loaded.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--event-muted)]">
          Try again. If the problem continues, check the connected backend
          service before making changes.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 min-h-11 rounded-[var(--event-radius-sm)] bg-[var(--event-heading)] px-5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
