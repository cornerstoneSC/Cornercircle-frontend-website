"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({
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
    <main className="grid min-h-[65vh] place-items-center bg-[#f8f5ef] px-5 py-20 text-[#2b1d35]">
      <section className="w-full max-w-2xl border border-[#dccfbe] bg-[#fffdf9] p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a77925]">
          Cornerstone Social Circle
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          We couldn&apos;t load this page.
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-[#625b64]">
          The website may be temporarily unavailable. Your information has not
          been submitted or charged.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="min-h-12 bg-[#2b1d35] px-6 font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center border border-[#b8892c] px-6 font-semibold text-[#8e641f]"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
