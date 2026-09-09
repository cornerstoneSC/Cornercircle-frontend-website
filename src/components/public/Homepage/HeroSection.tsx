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

  const ctaButtons = (
    <>
      {onEdit ? (
        <span className="inline-flex min-h-12 items-center justify-center border border-[#2d231e] bg-[#2d231e] px-6 text-sm font-medium text-[#fffaf0]">
          {text("primaryButtonText", content.primaryButtonText)}
        </span>
      ) : (
        <Link
          href={content.primaryButtonLink}
          className="group inline-flex min-h-12 items-center justify-center gap-2 border border-[#2d231e] bg-[#2d231e] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#fffaf0] shadow-[0_6px_18px_rgba(45,35,30,.12)] transition-colors hover:border-[#49372e] hover:bg-[#49372e] sm:px-8 lg:text-sm lg:font-medium lg:normal-case lg:tracking-normal"
        >
          <span className="lg:hidden">View Events</span>
          <span className="hidden lg:inline">{content.primaryButtonText}</span>
        </Link>
      )}

      {onEdit ? (
        <span className="inline-flex min-h-12 items-center justify-center border border-[#a87825] px-6 text-sm font-medium text-[#8b621f]">
          {text("secondaryButtonText", content.secondaryButtonText)}
        </span>
      ) : (
        <Link
          href={content.secondaryButtonLink}
          className="inline-flex min-h-12 items-center justify-center border border-[#a87825] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#8b621f] transition-colors hover:bg-[#efe4d1] hover:text-[#5f4216] sm:px-8 lg:text-sm lg:font-medium lg:normal-case lg:tracking-normal"
        >
          <span className="lg:hidden">Our Story</span>
          <span className="hidden lg:inline">{content.secondaryButtonText}</span>
        </Link>
      )}
    </>
  );

  return (
    <section className="relative isolate overflow-hidden bg-[#f8f5ef]">
      <div className="mx-auto grid max-w-[1680px] items-center justify-items-center gap-12 px-0 pb-20 pt-0 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-14 lg:pt-32 lg:[zoom:1.1] xl:gap-20 xl:px-16 2xl:px-20">
        {/* Editorial text panel */}
        <div className="relative z-10 order-1 mx-auto grid w-full min-w-0 max-w-[650px] grid-cols-[24px_minmax(0,1fr)] items-start gap-4 overflow-hidden px-5 pt-16 sm:grid-cols-[28px_minmax(0,1fr)] sm:gap-6 sm:px-10 lg:overflow-visible lg:px-0 lg:pt-0 xl:gap-7">
          {content.eyebrow && (
            <div className="flex flex-col items-center gap-3 self-stretch">
              <p className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-[#a87825] [writing-mode:vertical-rl] rotate-180 xl:mt-1">
                Cornerstone Social Circle
              </p>
              <span className="w-px flex-1 bg-[#b8862b]/60" aria-hidden="true" />
            </div>
          )}

          <div className="relative">
            <h1 className="mb-8 max-w-[570px] text-[clamp(3.1875rem,4.8vw,4.625rem)] font-medium leading-[0.92] tracking-[-0.04em] text-[#272220] [font-family:var(--font-cormorant)] lg:mb-0">
              <span className="block">{text("titleLineOne", content.titleLineOne)}</span>
              <span className="inline-block lg:block">{text("highlightedText", content.highlightedText)}</span>
              <span className="block whitespace-nowrap text-[#a87825]">{text("titleLineTwo", content.titleLineTwo)}</span>
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

            <p className="max-w-[570px] text-[19px] font-semibold leading-[1.5] text-[#3e3934] [font-family:var(--font-cormorant)]">
              {text("description", content.description)}
            </p>

            <div className="mt-8 hidden flex-row items-center gap-3 lg:flex">
              {ctaButtons}
            </div>
          </div>
        </div>

        {/* Layered editorial image panel */}
        <div className="relative order-2 mx-auto w-full max-w-[520px] px-6 pb-8 sm:px-10 lg:max-w-[720px] lg:px-0 lg:pb-12 lg:pr-8">
          <div
            className="absolute inset-x-5 bottom-5 top-6 hidden translate-x-4 bg-gradient-to-br from-[#c9a25a] to-[#3d2b3f] lg:block lg:inset-x-10 lg:bottom-7 lg:translate-x-8"
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

        {/* Mobile-only CTA row, placed right after the hero photo */}
        <div className="order-3 flex w-full max-w-[520px] flex-row items-center justify-center gap-3 px-6 lg:hidden">
          {ctaButtons}
        </div>
      </div>
    </section>
  );
}
