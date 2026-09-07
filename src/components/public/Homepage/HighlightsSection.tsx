"use client";

import {
  CalendarHeart,
  Handshake,
  Heart,
  RotateCcw,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ValueItem = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const values: ValueItem[] = [
  {
    number: "01",
    title: "Meaningful Connections",
    description:
      "Real conversations that grow into genuine, lasting friendships.",
    icon: Users,
  },
  {
    number: "02",
    title: "Quality Gatherings",
    description:
      "Thoughtfully curated experiences that make connection feel natural.",
    icon: CalendarHeart,
  },
  {
    number: "03",
    title: "Supportive Community",
    description:
      "A welcoming space where you can feel seen, supported, and included.",
    icon: Heart,
  },
  {
    number: "04",
    title: "Personal Growth",
    description:
      "Grow alongside a community that encourages confidence and new experiences.",
    icon: Sprout,
  },
  {
    number: "05",
    title: "Lasting Friendships",
    description:
      "Connections designed to continue long after the gathering ends.",
    icon: Handshake,
  },
];

export default function WhyCornerstoneUnfold() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // 3-7 = cards 01-05 unfold directly.
  const [stage, setStage] = useState(3);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          playAnimation();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasPlayed]);

  function playAnimation() {
    setStage(3);

    const timers = [
      window.setTimeout(() => setStage(4), 700),
      window.setTimeout(() => setStage(5), 1400),
      window.setTimeout(() => setStage(6), 2100),
      window.setTimeout(() => setStage(7), 2800),
    ];

    return () => timers.forEach(window.clearTimeout);
  }

  function replay() {
    setStage(3);

    window.setTimeout(() => {
      playAnimation();
    }, 250);
  }

  const fullyOpened = stage >= 7;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8F4ED] px-5 py-24 md:px-8 lg:py-32"
    >
      {/* subtle background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(98,72,43,.12) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* decorative background circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 hidden h-[420px] w-[420px] rounded-full border border-[#D9C49C]/30 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-32 hidden h-[310px] w-[310px] rounded-full border border-[#C9A86A]/20 lg:block"
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* section heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B88935]">
            Why Cornerstone
          </p>

          <h2 className="mt-5 font-serif text-[36px] leading-[1.05] tracking-[-0.025em] text-[#332033] md:text-[46px] lg:text-[54px]">
            Something real begins here.
          </h2>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#C7A363]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#B88935]" />
            <span className="h-px w-10 bg-[#C7A363]" />
          </div>
        </div>

        {/* =====================================================
            DESKTOP 3D UNFOLD
        ====================================================== */}
        <div className="relative hidden min-h-[520px] lg:block">
          <div
            className="
              relative mx-auto flex h-[440px]
              max-w-[1280px]
              items-center justify-center
              [perspective:2200px]
              [transform-style:preserve-3d]
            "
          >
            {/* The original closed-book intro is intentionally skipped. */}
            <div
              className="
                hidden absolute left-1/2 top-1/2
                h-[390px] w-[340px]
                -translate-x-1/2 -translate-y-1/2
                transition-all
                duration-1000
                ease-[cubic-bezier(.22,1,.36,1)]
                [transform-style:preserve-3d]
              "
              style={{
                opacity: stage >= 3 ? 0 : 1,
                pointerEvents: stage >= 3 ? "none" : "auto",
                transform:
                  stage >= 2
                    ? "translate(-50%, -50%) rotateY(-68deg) translateX(-130px)"
                    : "translate(-50%, -50%) rotateY(0deg)",
                transformOrigin: "left center",
              }}
            >
              {/* booklet depth */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[8px] border border-[#CFBEA3] bg-[#D8CFC2]" />
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[8px] border border-[#DDD0BC] bg-[#ECE4D8]" />

              {/* booklet cover */}
              <div
                className="
                  absolute inset-0
                  flex flex-col items-center justify-center
                  rounded-[8px]
                  border border-[#D4BC8B]
                  bg-[#FCF8EF]
                  px-10
                  text-center
                  shadow-[0_28px_70px_rgba(65,45,25,0.18)]
                "
              >
                {/* inner frame */}
                <div className="absolute inset-5 border border-[#D8C098]/60" />

                <div className="absolute left-8 top-8 h-10 w-10 border-l border-t border-[#CDA963]/70" />
                <div className="absolute right-8 top-8 h-10 w-10 border-r border-t border-[#CDA963]/70" />
                <div className="absolute bottom-8 left-8 h-10 w-10 border-b border-l border-[#CDA963]/70" />
                <div className="absolute bottom-8 right-8 h-10 w-10 border-b border-r border-[#CDA963]/70" />

                <p className="relative text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B88935]">
                  Cornerstone Social Circle
                </p>

                <h3 className="relative mt-8 font-serif text-[42px] leading-[1.02] tracking-[-0.025em] text-[#382438]">
                  Why
                  <br />
                  Cornerstone
                </h3>

                <p className="relative mt-6 max-w-[220px] font-serif text-[16px] italic leading-6 text-[#796D66]">
                  Five things that make our community different.
                </p>

                {/* Wax seal */}
                <div
                  className={`
                    absolute -bottom-10 left-1/2
                    flex h-[82px] w-[82px]
                    -translate-x-1/2
                    items-center justify-center
                    rounded-full
                    border-[5px] border-[#EEE1C9]
                    bg-[#D3B16E]
                    shadow-[0_12px_25px_rgba(75,52,28,.22)]
                    transition-all duration-700
                    ${
                      stage >= 1
                        ? "translate-y-12 rotate-[22deg] scale-75 opacity-0"
                        : ""
                    }
                  `}
                >
                  <div className="absolute inset-[7px] rounded-full border border-[#8C6B35]/45" />

                  <span className="font-serif text-[21px] text-[#72552E]">
                    CS
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                UNFOLDING PANELS
            ================================================== */}
            <div
              className="
                absolute inset-x-0 top-1/2
                flex -translate-y-1/2
                items-stretch justify-center
                [perspective:2200px]
                [transform-style:preserve-3d]
              "
            >
              {values.map((item, index) => {
                const Icon = item.icon;

                const visible = stage >= index + 3;

                // Alternate the hinge direction so it feels like
                // a physical accordion/booklet.
                const comesFromLeft = index % 2 === 0;

                return (
                  <div
                    key={item.number}
                    className="
                      relative
                      h-[390px]
                      w-[19%]
                      min-w-0
                      [transform-style:preserve-3d]
                    "
                    style={{
                      zIndex: index + 1,
                    }}
                  >
                    <div
                      className="
                        absolute inset-[5px]
                        transition-all
                        duration-[850ms]
                        ease-[cubic-bezier(.22,1,.36,1)]
                        [transform-style:preserve-3d]
                      "
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible
                          ? "rotateY(0deg) translateZ(0px) translateX(0px)"
                          : comesFromLeft
                            ? "rotateY(88deg) translateX(60px)"
                            : "rotateY(-88deg) translateX(-60px)",
                        transformOrigin: comesFromLeft
                          ? "right center"
                          : "left center",
                      }}
                    >
                      {/* paper layers */}
                      <div className="absolute inset-0 translate-x-[7px] translate-y-[8px] rounded-[5px] border border-[#D6C8B2] bg-[#E1D7C9]" />

                      {/* main card */}
                      <div
                        className="
                          absolute inset-0
                          flex flex-col
                          overflow-hidden
                          rounded-[5px]
                          border border-[#DDD0BA]
                          bg-[#FCF9F2]
                          px-6 py-7
                          text-center
                          shadow-[0_22px_45px_rgba(74,52,27,0.12)]
                        "
                      >
                        {/* inner border */}
                        <div className="pointer-events-none absolute inset-3 border border-[#DDC9A4]/45" />

                        {/* number */}
                        <p className="relative font-serif text-[30px] text-[#B48635]">
                          {item.number}
                        </p>

                        {/* icon */}
                        <div
                          className="
                            relative mx-auto mt-5
                            flex h-12 w-12
                            items-center justify-center
                            rounded-full
                            border border-[#DDC492]
                            bg-[#F5ECDE]
                          "
                        >
                          <Icon
                            className="h-5 w-5 text-[#B88935]"
                            strokeWidth={1.45}
                          />
                        </div>

                        <h3
                          className="
                            relative mt-6
                            font-serif
                            text-[23px]
                            leading-[1.05]
                            text-[#392438]
                          "
                        >
                          {item.title}
                        </h3>

                        <div className="relative mx-auto mt-5 flex items-center gap-2">
                          <span className="h-px w-5 bg-[#C7A261]" />
                          <span className="h-1 w-1 rotate-45 bg-[#B88935]" />
                          <span className="h-px w-5 bg-[#C7A261]" />
                        </div>

                        <p className="relative mt-5 text-[12px] leading-[1.7] text-[#726A65]">
                          {item.description}
                        </p>

                        {/* subtle number in background */}
                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute -bottom-8 -right-3
                            font-serif text-[105px]
                            text-[#B88935]/[0.045]
                          "
                        >
                          {item.number}
                        </span>
                      </div>

                      {/* gold hinge */}
                      {index < values.length - 1 && visible && (
                        <div
                          aria-hidden="true"
                          className="
                            absolute -right-[13px] top-1/2 z-20
                            h-[12px] w-[26px]
                            -translate-y-1/2
                            rounded-full
                            border-2 border-[#9B7432]
                            bg-[#D8B76D]
                            shadow-sm
                          "
                        >
                          <div className="absolute inset-x-1 top-[2px] h-[3px] rounded-full bg-[#F0D899]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* completion / replay */}
          <div
            className={`
              mt-5 flex justify-center
              transition-all duration-700
              ${
                fullyOpened
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
            `}
          >
            <button
              type="button"
              onClick={replay}
              className="
                group inline-flex items-center gap-2
                text-[10px] font-semibold
                uppercase tracking-[0.2em]
                text-[#A17B3E]
                transition-colors
                hover:text-[#76592E]
              "
            >
              <RotateCcw
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-45"
                strokeWidth={1.5}
              />

              Replay Story
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE
        ====================================================== */}
        <div className="lg:hidden">
          <div className="space-y-3">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className={`
                    relative overflow-hidden
                    border border-[#DFD3C1]
                    bg-[#FCF9F2]
                    px-5 py-6
                    shadow-[0_10px_28px_rgba(70,50,29,.07)]
                    transition-all duration-700
                    ${
                      stage >= index + 3
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4EADB]">
                      <Icon
                        className="h-5 w-5 text-[#B88935]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold tracking-[0.2em] text-[#B88935]">
                        {item.number}
                      </p>

                      <h3 className="mt-1 font-serif text-[23px] text-[#382438]">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] leading-6 text-[#716964]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
