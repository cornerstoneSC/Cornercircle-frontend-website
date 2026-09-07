import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import EditableText from "@/components/public/services/EditableText";

import type { HeroContent } from "@/types/homepage";

type HeroSectionProps = {
  content: HeroContent;
  photoControls?: ReactNode;
  onEdit?: (key: keyof HeroContent, value: string) => void;
};

export default function HeroSection({
  content,
  photoControls,
  onEdit,
}: HeroSectionProps) {
  const text = (key: keyof HeroContent, value: string) => onEdit ? <EditableText label={`hero ${key}`} value={value} onChange={(next) => onEdit(key, next)} /> : value;
  return (
    <section className="relative isolate overflow-hidden bg-[#f8f5ef]">
      <div className="mx-auto grid max-w-[1680px] items-center justify-items-center gap-12 px-0 pb-20 pt-0 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-14 lg:pt-32 lg:[zoom:1.1] xl:gap-20 xl:px-16 2xl:px-20">
        {/* Editorial text panel */}
        <div className="relative z-10 order-1 mx-auto grid w-full min-w-0 max-w-[650px] items-start gap-6 overflow-hidden px-6 pt-16 sm:px-10 lg:overflow-visible lg:px-0 lg:pt-0 xl:grid-cols-[28px_minmax(0,1fr)] xl:gap-7">
          {content.eyebrow && (
            <div className="flex items-center gap-3 xl:h-full xl:flex-col xl:self-stretch">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f5752] xl:mt-1 xl:[writing-mode:vertical-rl] xl:rotate-180">
                Cornerstone Social Circle
              </p>
              <span className="hidden h-px w-12 bg-[#b8862b]/60 lg:block xl:h-auto xl:min-h-16 xl:w-px xl:flex-1" aria-hidden="true" />
            </div>
          )}

          <div className="relative">
            <h1 className="mb-8 max-w-[570px] text-[clamp(3.15rem,13.5vw,3.5rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[#272220] [font-family:var(--font-cormorant)] sm:text-[3.5rem] lg:mb-0 lg:text-[3.65rem] xl:text-[4.25rem]">
              <span className="block">{text("titleLineOne", content.titleLineOne)}</span>
              <span className="relative inline-block after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:rotate-[-1deg] after:bg-[#b8862b] after:content-[''] lg:block lg:after:hidden">{text("highlightedText", content.highlightedText)}</span>
              <span className="block whitespace-nowrap">{text("titleLineTwo", content.titleLineTwo)}</span>
            </h1>

            <div className="my-7 hidden max-w-[570px] items-center gap-4 text-[#aa8242] lg:flex" aria-hidden="true">
              <span className="h-px flex-1 bg-[#b8862b]/50" />
              <span className="relative inline-flex h-8 w-14 items-center justify-center text-[1.9rem] italic leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
                <span className="absolute left-0 top-0">C</span>
                <span className="absolute left-[17px] top-0.5">S</span>
                <span className="absolute left-8 top-0">C</span>
              </span>
              <span className="h-px flex-1 bg-[#b8862b]/50" />
            </div>

            <p className="max-w-[430px] text-base leading-7 text-[#393330]">
              {text("description", content.description)}
            </p>

            <div className="mt-8 flex flex-row items-center gap-3">
              {onEdit ? <span className="inline-flex min-h-12 items-center justify-center border border-[#2d231e] bg-[#2d231e] px-5 text-sm font-medium text-[#fffaf0]">{text("primaryButtonText",content.primaryButtonText)}</span> : <Link
                href={content.primaryButtonLink}
                className="inline-flex min-h-12 items-center justify-center border border-[#2d231e] bg-[#2d231e] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#fffaf0] shadow-[0_6px_18px_rgba(45,35,30,.12)] transition-colors hover:border-[#49372e] hover:bg-[#49372e] sm:px-7 lg:text-sm lg:font-medium lg:normal-case lg:tracking-normal"
              >
                <span className="lg:hidden">View Events</span>
                <span className="hidden lg:inline">{content.primaryButtonText}</span>
              </Link>}

              {onEdit ? <span className="inline-flex min-h-12 items-center justify-center border border-[#a87825] px-5 text-sm font-medium text-[#8b621f]">{text("secondaryButtonText",content.secondaryButtonText)}</span> : <Link
                href={content.secondaryButtonLink}
                className="inline-flex min-h-12 items-center justify-center border border-[#a87825] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8b621f] transition-colors hover:bg-[#efe4d1] hover:text-[#5f4216] sm:px-7 lg:text-sm lg:font-medium lg:normal-case lg:tracking-normal"
              >
                <span className="lg:hidden">Our Story</span>
                <span className="hidden lg:inline">{content.secondaryButtonText}</span>
              </Link>}
            </div>
          </div>
        </div>

        {/* Layered editorial image panel */}
        <div className="relative order-2 mx-auto w-full max-w-[520px] px-6 pb-8 sm:px-10 lg:max-w-[720px] lg:px-0 lg:pb-12 lg:pr-8">
          <div
            className="absolute inset-x-5 bottom-5 top-6 hidden translate-x-4 bg-[#ddd6cd] lg:block lg:inset-x-10 lg:bottom-7 lg:translate-x-8"
            aria-hidden="true"
          />

          <div className="relative aspect-square overflow-hidden border border-[#b8862b]/70 bg-stone-200 shadow-[0_18px_45px_rgba(52,45,41,0.10)] lg:aspect-[4/3] lg:border-0">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
              fill
              preload
              unoptimized={content.imageUrl.startsWith("blob:")}
              sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            {photoControls}
          </div>

          <Image
            src="/images/home/connection-note.png"
            alt="Connection feels better in person."
            width={1536}
            height={1024}
            className="pointer-events-none absolute -bottom-8 right-1 z-10 h-auto w-[185px] rotate-2 drop-shadow-[0_12px_18px_rgba(52,45,41,0.20)] sm:right-4 sm:w-[220px] lg:-bottom-8 lg:-right-6 lg:w-[305px] lg:rotate-0"
          />
        </div>
      </div>
    </section>
  );
}
