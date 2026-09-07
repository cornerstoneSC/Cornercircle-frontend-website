"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CalendarDays,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { Event } from "@/types/event";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;
function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
function date(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
function time(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hour, minute));
}

function StripePayment({
  total,
  slug,
  registrationId,
}: {
  total: number;
  slug: string;
  registrationId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/events/${encodeURIComponent(slug)}/register/success?registration_id=${encodeURIComponent(registrationId)}`,
      },
    });
    if (result.error) {
      setError(result.error.message || "Payment could not be completed.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={pay} className="mt-9">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-[#B8892C] font-serif text-[#A77925]">
          02
        </span>
        <h2 className="font-serif text-3xl">Secure payment</h2>
      </div>
      <div className="border border-[#DCCFBE] bg-white p-4 sm:p-6">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {error && (
        <p className="mt-4 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <button
        disabled={!stripe || busy}
        className="mt-5 min-h-14 w-full bg-[#2B1D35] px-5 text-sm font-semibold uppercase tracking-[.12em] text-white disabled:opacity-50"
      >
        {busy ? "Processing…" : `Pay ${money(total)} & reserve my seat`}
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#74806F]">
        <LockKeyhole className="h-4 w-4" />
        Card details are securely handled by Stripe.
      </p>
    </form>
  );
}

export default function EventRegistrationCheckout({ event }: { event: Event }) {
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [clientSecret, setClientSecret] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const total = event.pricePerPerson * quantity;
  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: "stripe" as const,
              variables: {
                colorPrimary: "#2B1D35",
                colorText: "#2B1D35",
                colorBackground: "#FFFDF9",
                borderRadius: "3px",
              },
            },
          }
        : null,
    [clientSecret],
  );

  async function continueToPayment(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (event.pricePerPerson > 0 && !stripePromise)
        throw new Error("Secure payment is not configured.");
      const response = await fetch(
        `/api/events/${encodeURIComponent(event.slug)}/registrations/payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...contact,
            guestCount: quantity,
            ageConfirmed,
            termsAccepted,
          }),
        },
      );
      const data = (await response.json()) as {
        registrationId?: string;
        status?: string;
        clientSecret?: string;
        detail?: string;
        message?: string;
      };
      if (!response.ok || !data.registrationId)
        throw new Error(
          data.detail ||
            data.message ||
            "Secure payment could not be prepared.",
        );
      if (data.status === "CONFIRMED") {
        window.location.assign(
          `/events/${encodeURIComponent(event.slug)}/register/success?registration_id=${encodeURIComponent(data.registrationId)}`,
        );
        return;
      }
      if (!data.clientSecret)
        throw new Error("Secure payment could not be prepared.");
      setRegistrationId(data.registrationId);
      setClientSecret(data.clientSecret);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Secure payment could not be prepared.",
      );
    } finally {
      setBusy(false);
    }
  }

  const location = [event.venueName, event.city, event.state]
    .filter(Boolean)
    .join(" · ");
  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#2B1D35]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-7 lg:grid-cols-[minmax(0,1.55fr)_390px] lg:px-8 lg:py-12">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#A77925]">
            Cornerstone gathering
          </p>
          <h1 className="mt-2 font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Reserve your place.
          </h1>
          <p className="mt-4 text-lg text-[#625B64]">
            A few details, then your seat is yours.
          </p>
          <div className="mt-7 grid items-center gap-4 border border-[#C69A4A] bg-[#FFFDF9] p-5 sm:grid-cols-[auto_1fr_auto_auto] sm:p-6">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-[#B8892C] text-[#A77925]">
              <Ticket className="h-6 w-6" />
            </span>
            <div>
              <strong className="font-serif text-2xl font-normal">
                General Admission
              </strong>
              <span className="mt-1 block text-sm">
                {event.pricePerPerson === 0
                  ? "Free"
                  : `${money(event.pricePerPerson)} per person`}
              </span>
              <span className="mt-1 block text-sm text-[#74806F]">
                Limited availability
              </span>
            </div>
            <div className="flex w-fit border border-[#DCCFBE]">
              <button
                type="button"
                aria-label="Remove ticket"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-12 w-12 place-items-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <output className="grid h-12 w-12 place-items-center border-x border-[#DCCFBE] text-lg">
                {quantity}
              </output>
              <button
                type="button"
                aria-label="Add ticket"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="grid h-12 w-12 place-items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          {!clientSecret && (
            <form onSubmit={continueToPayment} className="mt-9">
              <h2 className="mb-5 font-serif text-3xl">Your details</h2>
              <div className="space-y-4">
                {[
                  ["Full name", "text", "fullName", "Enter your full name"],
                  [
                    "Email address",
                    "email",
                    "email",
                    "Enter your email address",
                  ],
                  [
                    "Phone number (optional)",
                    "tel",
                    "phone",
                    "Enter your phone number (optional)",
                  ],
                ].map(([label, type, key, placeholder]) => (
                  <label
                    key={key}
                    className="block text-sm font-medium text-[#332D35]"
                  >
                    {label}
                    <input
                      required={key !== "phone"}
                      type={type}
                      placeholder={placeholder}
                      value={contact[key as keyof typeof contact]}
                      onChange={(e) =>
                        setContact({ ...contact, [key]: e.target.value })
                      }
                      className="mt-2 block h-13 w-full border border-[#DCCFBE] bg-[#FFFDF9] px-4 text-base font-normal outline-none placeholder:text-[#9A939A] focus:border-[#B8892C]"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 space-y-4 border-t border-[#DDD1C1] pt-5">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#554F57]">
                  <input
                    className="mt-1 h-5 w-5 accent-[#2B1D35]"
                    type="checkbox"
                    required
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                  />
                  I confirm that I and every guest included in my registration
                  will be at least 21 years old on the event date.
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#554F57]">
                  <input
                    className="mt-1 h-5 w-5 accent-[#2B1D35]"
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link
                      href="/event-terms"
                      target="_blank"
                      className="font-semibold text-[#8E641F] underline underline-offset-2"
                  >
                    Event Terms and Cancellation Policy
                  </Link>
                  .
                </span>
                </label>
              </div>
              {error && (
                <p className="mt-4 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                disabled={busy || !ageConfirmed || !termsAccepted}
                className="mt-5 min-h-14 w-full bg-[#2B1D35] px-5 text-sm font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#3A2945] disabled:opacity-50"
              >
                {busy
                  ? "Preparing registration…"
                  : event.pricePerPerson === 0
                    ? "Reserve my place"
                    : "Continue to secure payment"}
              </button>
            </form>
          )}
          {clientSecret && registrationId && options && stripePromise && (
            <Elements stripe={stripePromise} options={options}>
              <StripePayment
                total={total}
                slug={event.slug}
                registrationId={registrationId}
              />
            </Elements>
          )}
        </section>
        <aside className="order-first overflow-hidden border border-[#DDD1C1] bg-[#FFFDF9] lg:order-none lg:sticky lg:top-24">
          <div className="relative h-64 bg-[#E9E1D7]">
            {event.coverImageUrl && (
              <Image
                src={event.coverImageUrl}
                alt={`${event.title} event`}
                fill
                sizes="(max-width: 1024px) 100vw, 390px"
                className="object-cover"
              />
            )}
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#A77925]">
              Your gathering
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight">
              {event.title}
            </h2>
            <div className="mt-6 space-y-3 text-sm text-[#554F57]">
              <p className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#A77925]" />
                {date(event.eventDate)} · {time(event.startTime)} –{" "}
                {time(event.endTime)}
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#A77925]" />
                {location}
              </p>
            </div>
            <div className="mt-6 border-t border-[#DDD1C1] text-sm">
              <p className="flex justify-between py-5">
                <span>{quantity} × General Admission</span>
                <strong>{money(total)}</strong>
              </p>
              <p className="flex justify-between border-y border-[#EAE2D7] py-5 font-serif text-3xl">
                <span>Total</span>
                <strong className="font-normal">{money(total)}</strong>
              </p>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-[#74806F]">
              <LockKeyhole className="h-4 w-4" />
              {event.pricePerPerson === 0
                ? "No payment is required for this event."
                : "Secure payment powered by Stripe."}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
