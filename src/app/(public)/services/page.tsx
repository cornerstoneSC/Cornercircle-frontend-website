import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Services Coming Soon | Cornerstone Social Circle",
  description: "Thoughtful new services from Cornerstone Social Circle are coming soon.",
};

export default function ServicesPage() {
  return (
    <main className="relative isolate grid min-h-[70vh] overflow-hidden bg-[#f3ede3] px-6 py-20 text-[#332033] sm:py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b1843b]/10" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b1843b]/15" />
      <section className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
        <span className="grid h-16 w-16 place-items-center border border-[#b1843b]/60 text-[#9c6f21]">
          <HeartHandshake className="h-7 w-7" strokeWidth={1.4} />
        </span>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#9c6f21]">Cornerstone Social Circle</p>
        <h1 className="mt-5 font-serif text-5xl font-normal leading-[0.95] sm:text-7xl">Something thoughtful is coming.</h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#655d58] sm:text-lg">
          We are thoughtfully preparing services designed around companionship, care, and meaningful connection. More details will be shared soon.
        </p>
        <Link href="/contact" className="mt-10 inline-flex min-h-14 items-center gap-3 bg-[#332033] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#493349]">
          Contact us <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
