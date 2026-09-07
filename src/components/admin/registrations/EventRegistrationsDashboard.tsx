"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Mail, Search, Ticket, Users, X } from "lucide-react";
import {
  getEventRegistrations,
  type AdminEventRegistration,
  type AdminEventRegistrationsResponse,
} from "@/services/event-registrations-admin.service";
import "./event-registrations.css";

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

export default function EventRegistrationsDashboard() {
  const [data, setData] = useState<AdminEventRegistrationsResponse | null>(
    null,
  );
  const [selected, setSelected] = useState<AdminEventRegistration | null>(null);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("");
  const [error, setError] = useState("");

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
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label>
            <CalendarDays size={18} />
            <select
              aria-label="Filter by event"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
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
              {visible.map((item) => (
                <tr
                  key={item.registrationId}
                  className={
                    selected?.registrationId === item.registrationId
                      ? "selected"
                      : ""
                  }
                >
                  <td>
                    <b>{item.fullName}</b>
                    <small>{item.email}</small>
                  </td>
                  <td>{item.eventTitle}</td>
                  <td>{item.ticketQuantity}</td>
                  <td>{money.format(item.amountPaid)}</td>
                  <td>
                    <Paid />
                  </td>
                  <td>{date.format(new Date(item.registrationDate))}</td>
                  <td>{item.checkedInAt ? "Checked in" : "Not arrived"}</td>
                  <td>
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
        </div>
        {selected && (
          <Details item={selected} close={() => setSelected(null)} />
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
  return (
    <aside className="registration-details">
      <button
        className="details-close"
        onClick={close}
        aria-label="Close details"
      >
        <X />
      </button>
      <div className="details-heading">
        <span>⌁</span>
        <h2>Registration details</h2>
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
      <div className="details-actions">
        <a href={`mailto:${item.email}`}>
          <Mail />
          Email attendee
        </a>
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
