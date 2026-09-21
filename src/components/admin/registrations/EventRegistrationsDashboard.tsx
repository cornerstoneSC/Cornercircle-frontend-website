"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Mail, Search, Ticket, Users, X } from "lucide-react";
import {
  getEventRegistrations,
  sendRegistrationConfirmationEmail,
  type AdminEventRegistration,
  type AdminEventRegistrationsResponse,
} from "@/services/event-registrations-admin.service";
import "./event-registrations.css";
import useDialogFocus from "@/hooks/useDialogFocus";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const PAGE_SIZE = 15;

export default function EventRegistrationsDashboard() {
  const [data, setData] = useState<AdminEventRegistrationsResponse | null>(
    null,
  );
  const [selected, setSelected] = useState<AdminEventRegistration | null>(null);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEventRegistrations()
      .then(setData)
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load registrations.",
        ),
      );
  }, []);
  const events = useMemo(
    () =>
      Array.from(
        new Map(
          (data?.registrations ?? []).map((item) => [
            item.eventSlug,
            item.eventTitle,
          ]),
        ).entries(),
      ),
    [data],
  );
  const visible = useMemo(
    () =>
      (data?.registrations ?? []).filter((item) => {
        const needle = query.trim().toLowerCase();
        return (
          (!event || item.eventSlug === event) &&
          (!needle ||
            [
              item.fullName,
              item.email,
              item.eventTitle,
              item.confirmationNumber,
            ].some((value) => value.toLowerCase().includes(needle)))
        );
      }),
    [data, event, query],
  );
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!data)
    return (
      <section className="registrations-state">
        <span />
        {error || "Loading registrations…"}
      </section>
    );

  return (
    <section className="registrations-page">
      <header className="registrations-header">
        <div>
          <p>Community</p>
          <h1>Event registrations</h1>
          <span>View attendees and confirm completed payments.</span>
        </div>
        <div className="registrations-filters">
          <label>
            <Search size={18} />
            <input
              aria-label="Search registrations"
              placeholder="Search registrations"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label>
            <CalendarDays size={18} />
            <select
              aria-label="Filter by event"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All events</option>
              {events.map(([slug, title]) => (
                <option key={slug} value={slug}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <div className="registrations-stats">
        <Stat
          icon={<Users />}
          label="Paid registrations"
          value={String(data.summary.paidRegistrations)}
        />
        <Stat
          icon={<Ticket />}
          label="Tickets sold"
          value={String(data.summary.ticketsSold)}
        />
        <Stat
          icon={<span className="stat-dollar">$</span>}
          label="Revenue"
          value={money.format(data.summary.revenue)}
        />
        <Stat icon={<CheckCircle2 />} label="Checked in" value={String(data.summary.checkedInTickets)} />
      </div>
      <div className="registrations-layout">
        <div className="registrations-table">
          <table>
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Event</th>
                <th>Tickets</th>
                <th>Amount paid</th>
                <th>Payment</th>
                <th>Registered</th>
                <th>Check-in</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item) => (
                <tr
                  key={item.registrationId}
                  className={
                    selected?.registrationId === item.registrationId
                      ? "selected"
                      : ""
                  }
                >
                  <td data-label="Attendee">
                    <b>{item.fullName}</b>
                    <small>{item.email}</small>
                  </td>
                  <td data-label="Event">{item.eventTitle}</td>
                  <td data-label="Tickets">{item.ticketQuantity}</td>
                  <td data-label="Amount paid">{money.format(item.amountPaid)}</td>
                  <td data-label="Payment">
                    <Paid />
                  </td>
                  <td data-label="Registered">{date.format(new Date(item.registrationDate))}</td>
                  <td data-label="Check-in">{item.checkedInAt ? "Checked in" : "Not arrived"}</td>
                  <td data-label="Details">
                    <button onClick={() => setSelected(item)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="registrations-empty">
              No paid registrations match your filters.
            </p>
          )}
          {visible.length > PAGE_SIZE && (
            <nav aria-label="Registration pages" className="registration-pagination">
              <button type="button" aria-label="Previous registration page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft /> Previous</button>
              <span>Page {currentPage} of {pageCount}</span>
              <button type="button" aria-label="Next registration page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next <ChevronRight /></button>
            </nav>
          )}
        </div>
        {selected && (
          <Details key={selected.registrationId} item={selected} close={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article>
      <i>{icon}</i>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
function Paid() {
  return <span className="paid-badge">Paid</span>;
}
function Details({
  item,
  close,
}: {
  item: AdminEventRegistration;
  close: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  useDialogFocus(dialogRef, close);
  const [emailSentAt, setEmailSentAt] = useState(item.confirmationEmailSentAt);
  const [emailError, setEmailError] = useState(item.confirmationEmailError || "");
  const [sendingEmail, setSendingEmail] = useState(false);
  async function sendEmail() {
    setSendingEmail(true); setEmailError("");
    try { const updated = await sendRegistrationConfirmationEmail(item.registrationId); setEmailSentAt(updated.confirmationEmailSentAt); setEmailError(updated.confirmationEmailError || ""); }
    catch (reason) { setEmailError(reason instanceof Error ? reason.message : "Unable to send confirmation email."); }
    finally { setSendingEmail(false); }
  }
  return (
    <aside ref={dialogRef} tabIndex={-1} className="registration-details" role="dialog" aria-modal="true" aria-labelledby="registration-details-title">
      <button
        className="details-close"
        onClick={close}
        aria-label="Close details"
      >
        <X />
      </button>
      <div className="details-heading">
        <span>⌁</span>
        <h2 id="registration-details-title">Registration details</h2>
      </div>
      <Info label="Attendee name" value={item.fullName} />
      <Info label="Email" value={item.email} />
      <Info label="Phone" value={item.phone || "—"} />
      <Info label="Event" value={item.eventTitle} />
      <Info label="Ticket quantity" value={String(item.ticketQuantity)} />
      <Info label="Amount paid" value={money.format(item.amountPaid)} />
      <div className="details-info">
        <span>Payment status</span>
        <Paid />
      </div>
      <Info
        label="Registration date"
        value={date.format(new Date(item.registrationDate))}
      />
      <Info label="Confirmation number" value={item.confirmationNumber} />
      <Info label="Check-in status" value={item.checkedInAt ? `Checked in ${date.format(new Date(item.checkedInAt))}` : "Not checked in"} />
      <Info label="Confirmation email" value={emailSentAt ? `Sent ${date.format(new Date(emailSentAt))}` : emailError || "Not sent"} />
      <div className="details-actions">
        <a href={`mailto:${item.email}`}>
          <Mail />
          Email attendee
        </a>
        <button type="button" onClick={sendEmail} disabled={sendingEmail || Boolean(emailSentAt)}>
          <Mail />
          {emailSentAt ? "Email sent" : sendingEmail ? "Sending…" : "Send ticket email"}
        </button>
        <a href={`/events/${item.eventSlug}`}>
          <CalendarDays />
          View event
        </a>
        <a href={`/admin/check-in?ticket=${encodeURIComponent(item.ticketToken)}`}>
          <CheckCircle2 />
          {item.checkedInAt ? "View check-in" : "Check in"}
        </a>
      </div>
    </aside>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="details-info">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
