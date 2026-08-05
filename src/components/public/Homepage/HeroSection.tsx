import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { HeroContent } from "@/types/homepage";

type HeroSectionProps = {
  content: HeroContent;
};

export default function HeroSection({
  content,
}: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-black md:min-h-[650px] lg:min-h-[560px]">
      {/* Background image */}
      <Image
        src={content.imageUrl}
        alt={content.imageAlt}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[65%_center] md:object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/15"
        aria-hidden="true"
      />

      {/* Extra mobile overlay for readability */}
      <div
        className="absolute inset-0 bg-black/20 md:hidden"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-16 sm:px-6 md:min-h-[650px] lg:min-h-[560px] lg:px-8">
        <div className="max-w-2xl">
          {content.eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold-light">
              {content.eyebrow}
            </p>
          )}

          <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-[-0.025em] text-white sm:text-6xl md:text-7xl lg:text-[5rem]">
            <span className="block">{content.titleLineOne}</span>

            <span className="mt-2 block text-gold-light">
              {content.highlightedText}
            </span>

            <span className="mt-2 block">
              {content.titleLineTwo}
            </span>
          </h1>

          {/* Decorative line */}
          <div
            className="mt-7 flex items-center gap-2"
            aria-hidden="true"
          >
            <span className="h-px w-16 bg-gold" />
            <span className="size-2 rotate-45 bg-gold" />
          </div>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={content.primaryButtonLink}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/40 bg-plum px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-plum-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
            >
              <CalendarDays size={18} aria-hidden="true" />

              {content.primaryButtonText}
            </Link>

            <Link
              href={content.secondaryButtonLink}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-gold bg-black/20 px-6 py-3 text-sm font-semibold text-gold-light backdrop-blur-sm transition hover:bg-gold hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
            >
              {content.secondaryButtonText}

              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}