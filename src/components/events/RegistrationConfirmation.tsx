"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, Mail, XCircle } from "lucide-react";
import Link from "next/link";

type RegistrationStatus = {
  registrationId: string;
  status: string;
  email: string;
};

export default function RegistrationConfirmation({
  slug,
  registrationId,
  eventTitle,
  eventDate,
}: {
  slug: string;
  registrationId: string;
  eventTitle: string;
  eventDate: string;
}) {
  const [registration, setRegistration] = useState<RegistrationStatus | null>(
    null,
  );
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let attempts = 0;
    async function check() {
      try {
        const response = await fetch(
          `/api/events/${encodeURIComponent(slug)}/registrations/${encodeURIComponent(registrationId)}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error();
        const value = (await response.json()) as RegistrationStatus;
        if (!active) return;
        setRegistration(value);
        if (value.status === "PENDING_PAYMENT" && attempts++ < 8)
          window.setTimeout(check, 1500);
      } catch {
        if (active) setFailed(true);
      }
    }
    void check();
    return () => {
      active = false;
    };
  }, [registrationId, slug]);
  const confirmed = registration?.status === "CONFIRMED";
  const paymentFailed = registration?.status === "PAYMENT_FAILED" || failed;
  return (
    <main className="grid min-h-[75vh] place-items-center bg-[#F8F5EF] px-5 py-16 text-[#2B1D35]">
      <section className="w-full max-w-2xl border border-[#DCCFBE] bg-[#FFFDF9] px-6 py-12 text-center shadow-[0_20px_60px_rgba(60,40,30,.08)] sm:px-14 sm:py-16">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#B8892C] text-[#A77925]">
          {confirmed ? (
            <Check className="h-7 w-7" />
          ) : paymentFailed ? (
            <XCircle className="h-7 w-7" />
          ) : (
            <Clock3 className="h-7 w-7" />
          )}
        </span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-[#A77925]">
          {confirmed
            ? "Registration successful"
            : paymentFailed
              ? "Registration incomplete"
              : "Confirming registration"}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">
          {confirmed
            ? "Your place is reserved."
            : paymentFailed
              ? "Your place was not reserved."
              : "We’re confirming your place."}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[#625B64]">
          {confirmed ? (
            <>
              Thank you for registering for <strong>{eventTitle}</strong>. We
              look forward to welcoming you.
            </>
          ) : paymentFailed ? (
            "Payment was not completed. Please return to the event and try again."
          ) : (
            "Payment confirmation can take a few seconds. This page will update automatically."
          )}
        </p>
        <div className="mx-auto mt-8 max-w-md border-y border-[#E6DDD2] py-5 text-left text-sm text-[#554F57]">
          <p className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 text-[#A77925]" />
            {eventDate}
          </p>
          {confirmed && registration?.email && (
            <p className="mt-4 flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-[#A77925]" />A confirmation
              was sent to {registration.email}.
            </p>
          )}
        </div>
        <Link
          href={paymentFailed ? `/events/${slug}` : "/events"}
          className="mt-9 inline-flex min-h-12 items-center justify-center bg-[#2B1D35] px-7 text-sm font-semibold uppercase tracking-[.12em] text-white"
        >
          {paymentFailed ? "Return to event" : "View more events"}
        </Link>
      </section>
    </main>
  );
}
