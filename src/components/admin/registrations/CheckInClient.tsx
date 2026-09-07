"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, ScanLine, TicketCheck, TriangleAlert } from "lucide-react";
import { checkInTicket, undoTicketCheckIn, validateTicket, type TicketCheckIn } from "@/services/event-registrations-admin.service";

function normalize(value: string) {
  const trimmed = value.trim();
  try { return new URL(trimmed).searchParams.get("ticket") || trimmed; } catch { return trimmed; }
}

export default function CheckInClient({ initialTicket }: { initialTicket: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [result, setResult] = useState<TicketCheckIn | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function validate(value = ticket) {
    const token = normalize(value);
    if (!token) return;
    setBusy(true); setError(""); setResult(null);
    try { setResult(await validateTicket(token)); setTicket(token); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Invalid ticket."); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    if (!initialTicket) return;
    let active = true;
    void validateTicket(normalize(initialTicket)).then((value) => { if (active) setResult(value); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Invalid ticket."); });
    return () => { active = false; };
  }, [initialTicket]);
  async function submit(event: FormEvent) { event.preventDefault(); await validate(); }
  async function checkIn() { setBusy(true); setError(""); try { setResult(await checkInTicket(normalize(ticket))); } catch (reason) { setError(reason instanceof Error ? reason.message : "Check-in failed."); } finally { setBusy(false); } }
  async function undo() { setBusy(true); setError(""); try { setResult(await undoTicketCheckIn(normalize(ticket))); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to undo check-in."); } finally { setBusy(false); } }

  return <section className="min-h-full bg-[var(--event-canvas)] p-5 text-[var(--event-text)] md:p-10"><div className="mx-auto max-w-2xl">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--event-accent-strong)]">Event entry</p><h1 className="mt-2 font-serif text-4xl text-[var(--event-heading)]">Ticket check-in</h1><p className="mt-3 text-[var(--event-muted)]">Scan the guest’s QR code with the phone camera, or paste the ticket code below.</p>
    <form onSubmit={submit} className="mt-7 flex gap-2"><label className="flex min-h-12 flex-1 items-center gap-3 border border-[var(--event-border)] bg-[var(--event-surface)] px-4"><ScanLine className="h-5 w-5 text-[var(--event-accent-strong)]" /><input className="w-full bg-transparent outline-none" value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Paste ticket code or scanned URL" aria-label="Ticket code" /></label><button disabled={busy || !ticket.trim()} className="bg-[var(--event-accent-strong)] px-6 font-semibold text-white disabled:opacity-50">Validate</button></form>
    {error && <div className="mt-6 flex gap-3 border border-red-300 bg-red-50 p-5 text-red-800"><TriangleAlert /> <span>{error}</span></div>}
    {result && <article className="mt-6 border border-[var(--event-border)] bg-[var(--event-surface)] p-6 shadow-sm"><div className="flex items-center gap-3">{result.checkedInAt ? <CheckCircle2 className="h-9 w-9 text-amber-600" /> : <TicketCheck className="h-9 w-9 text-green-700" />}<div><p className="text-xs font-bold uppercase tracking-widest text-[var(--event-muted)]">{result.checkedInAt ? "Already checked in" : "Valid ticket"}</p><h2 className="font-serif text-3xl text-[var(--event-heading)]">{result.fullName}</h2></div></div>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--event-border)] py-5 text-sm"><div><dt className="text-[var(--event-muted)]">Event</dt><dd className="font-semibold">{result.eventTitle}</dd></div><div><dt className="text-[var(--event-muted)]">Guests</dt><dd className="font-semibold">{result.guestCount}</dd></div><div><dt className="text-[var(--event-muted)]">Confirmation</dt><dd className="font-semibold">{result.confirmationNumber}</dd></div><div><dt className="text-[var(--event-muted)]">Status</dt><dd className="font-semibold">{result.checkedInAt ? new Date(result.checkedInAt).toLocaleString() : "Ready for entry"}</dd></div></dl>
      {result.checkedInAt ? <button onClick={undo} disabled={busy} className="mt-6 inline-flex min-h-12 items-center gap-2 border border-[var(--event-border)] px-5 font-semibold"><RotateCcw className="h-4 w-4" /> Undo check-in</button> : <button onClick={checkIn} disabled={busy} className="mt-6 min-h-12 w-full bg-green-800 px-6 font-semibold text-white">Check in {result.guestCount} {result.guestCount === 1 ? "attendee" : "attendees"}</button>}
    </article>}
  </div></section>;
}
