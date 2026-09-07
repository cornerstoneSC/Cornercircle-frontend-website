"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, MapPin, Ticket, Users, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type RegistrationStatus = {
  registrationId: string; status: string; email: string; fullName: string; guestCount: number;
  confirmationNumber: string; eventTitle: string; eventDate: string; startTime: string; endTime: string;
  venueName: string; address: string; city: string; state: string; zipCode: string;
};

export default function RegistrationConfirmation({ slug, registrationId, eventTitle, eventDate }: { slug: string; registrationId: string; eventTitle: string; eventDate: string }) {
  const [registration, setRegistration] = useState<RegistrationStatus | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true, attempts = 0;
    async function check() {
      try {
        const response = await fetch(`/api/events/${encodeURIComponent(slug)}/registrations/${encodeURIComponent(registrationId)}`, { cache: "no-store" });
        if (!response.ok) throw new Error();
        const value = await response.json() as RegistrationStatus;
        if (!active) return;
        setRegistration(value);
        if (value.status === "PENDING_PAYMENT" && attempts++ < 8) window.setTimeout(check, 1500);
      } catch { if (active) setFailed(true); }
    }
    void check(); return () => { active = false; };
  }, [registrationId, slug]);
  const confirmed = registration?.status === "CONFIRMED";
  const paymentFailed = registration?.status === "PAYMENT_FAILED" || failed;
  const cityLine = registration ? [registration.city, registration.state].filter(Boolean).join(", ") + (registration.zipCode ? ` ${registration.zipCode}` : "") : "";
  const qr = `/api/events/${encodeURIComponent(slug)}/registrations/${encodeURIComponent(registrationId)}/ticket.png`;
  const calendar = `/api/events/${encodeURIComponent(slug)}/registrations/${encodeURIComponent(registrationId)}/calendar.ics`;

  if (!confirmed) return <main className="grid min-h-[75vh] place-items-center bg-[#F8F5EF] px-5 py-16 text-[#2B1D35]"><section className="max-w-xl text-center">{paymentFailed ? <XCircle className="mx-auto h-14 w-14 text-red-700" /> : <Clock3 className="mx-auto h-14 w-14 text-[#B8892C]" />}<h1 className="mt-5 font-serif text-5xl">{paymentFailed ? "Your place was not reserved." : "We’re confirming your place."}</h1><p className="mt-4 text-[#625B64]">{paymentFailed ? "Payment was not completed. Please return to the event and try again." : "Payment confirmation can take a few seconds. This page updates automatically."}</p></section></main>;

  return <main className="min-h-[80vh] bg-[#F8F5EF] px-4 py-10 text-[#21162A] sm:py-16"><section className="mx-auto max-w-4xl text-center">
    <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#C28A2C] text-white"><Check /></span><p className="mt-4 text-sm font-semibold uppercase tracking-[.22em]">Your place is reserved</p>
    <div className="mt-8 overflow-hidden border border-[#D8CCBC] bg-[#FFFDF9] text-left shadow-[0_20px_55px_rgba(50,35,30,.09)] md:grid md:grid-cols-[1fr_310px]">
      <div className="p-6 sm:p-10"><h1 className="font-serif text-4xl sm:text-5xl">{registration.eventTitle || eventTitle}</h1><div className="mt-7 space-y-5 text-[#4F4852]">
        <p className="flex gap-3"><CalendarDays className="h-5 w-5 shrink-0 text-[#B47D22]" /><span>{eventDate}</span></p><p className="flex gap-3"><Clock3 className="h-5 w-5 shrink-0 text-[#B47D22]" /><span>{registration.startTime?.slice(0,5)}–{registration.endTime?.slice(0,5)}</span></p><p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-[#B47D22]" /><span>{registration.venueName}<br />{registration.address}<br />{cityLine}</span></p>
      </div><div className="mt-7 grid gap-4 border-t border-[#E4DACC] pt-6 sm:grid-cols-2"><p className="flex gap-3"><Users className="h-5 w-5 text-[#B47D22]" /><span><b className="block">{registration.fullName}</b>{registration.guestCount} {registration.guestCount === 1 ? "attendee" : "attendees"}</span></p><p className="flex gap-3"><Ticket className="h-5 w-5 text-[#B47D22]" /><span><small className="block uppercase tracking-wider">Confirmation</small><b>{registration.confirmationNumber}</b></span></p></div></div>
      <div className="grid place-items-center border-t border-dashed border-[#CDBFAE] p-7 text-center md:border-l md:border-t-0"><Image src={qr} width={224} height={224} unoptimized alt={`QR ticket ${registration.confirmationNumber}`} className="h-56 w-56 bg-white p-2" /><p className="mt-3 text-sm text-[#625B64]">Present this QR code at check-in</p></div>
    </div>
    <a href={calendar} download className="mt-7 inline-flex min-h-12 items-center gap-2 border border-[#B47D22] bg-[#FFFDF9] px-7 font-semibold text-[#6F4B13]"><CalendarDays className="h-5 w-5" /> Add to Calendar</a><div><Link href={`/events/${slug}`} className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">View event details</Link></div>
  </section></main>;
}
