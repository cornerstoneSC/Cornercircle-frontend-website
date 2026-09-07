"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Mail,
  Search,
  Users,
  X,
} from "lucide-react";
import PaymentBadge from "./PaymentBadge";
import {
  getAdminMembers,
  recordRenewalReminder,
  saveMemberNotes,
  sendMembershipWelcomeEmail,
  type AdminMember,
  type AdminMembersResponse,
} from "@/services/members-admin.service";
import "./members-dashboard.css";

const PAGE_SIZE = 8;
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const formatDate = (value: string | null) =>
  value ? shortDate.format(new Date(`${value.slice(0, 10)}T12:00:00`)) : "—";
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function MembersDashboard() {
  const [data, setData] = useState<AdminMembersResponse | null>(null);
  const [selected, setSelected] = useState<AdminMember | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [page, setPage] = useState(1);
  const closeButton = useRef<HTMLButtonElement>(null);

  const paidMembers = useMemo(
    () =>
      data?.members.filter((member) => member.paymentStatus === "PAID") ?? [],
    [data],
  );
  const expiringSoon = useMemo(
    () =>
      paidMembers.filter((member) => {
        if (!member.membershipEndsOn) return false;
        const days =
          (new Date(`${member.membershipEndsOn}T12:00:00`).getTime() -
            Date.now()) /
          86_400_000;
        return days >= 0 && days <= 60;
      }).length,
    [paidMembers],
  );
  const renewalReminders = useMemo(
    () => paidMembers.filter((member) => member.renewalReminderSentAt).length,
    [paidMembers],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const members = data?.members ?? [];
    return needle
      ? members.filter((member) =>
          [member.fullName, member.email, member.city].some((value) =>
            value.toLowerCase().includes(needle),
          ),
        )
      : members;
  }, [data, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (selected) closeButton.current?.focus();
  }, [selected]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setNotice("");
    try {
      setData(await getAdminMembers());
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to load members.",
      );
    } finally {
      setLoading(false);
    }
  }

  function choose(member: AdminMember) {
    setSelected(member);
    setNotes(member.internalNotes ?? "");
  }
  function replaceMember(updated: AdminMember) {
    setSelected(updated);
    setNotes(updated.internalNotes ?? "");
    setData((current) =>
      current
        ? {
            ...current,
            members: current.members.map((member) =>
              member.applicationId === updated.applicationId ? updated : member,
            ),
          }
        : current,
    );
  }

  async function prepareReminder(member: AdminMember) {
    const subject = "Your Cornerstone Social Circle membership";
    const body = `Hi ${member.fullName.split(" ")[0]},\n\nYour Cornerstone Social Circle membership ends on ${formatDate(member.membershipEndsOn)}. We would love to welcome you for another year.\n\nWarmly,\nCornerstone Social Circle`;
    try {
      const updated = await recordRenewalReminder(member.applicationId);
      replaceMember(updated);
      setNotice(
        "Renewal reminder prepared. Complete and send it in your email app.",
      );
      window.location.href = `mailto:${encodeURIComponent(member.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The reminder could not be prepared.",
      );
    }
  }

  async function saveNotes() {
    if (!selected) return;
    try {
      replaceMember(await saveMemberNotes(selected.applicationId, notes));
      setNotice("Internal notes saved.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Notes could not be saved.",
      );
    }
  }
  async function sendWelcomeEmail() {
    if (!selected) return;
    try { replaceMember(await sendMembershipWelcomeEmail(selected.applicationId)); setNotice("Membership welcome email sent."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Welcome email could not be sent."); }
  }

  function exportCsv() {
    const safe = (value: unknown) => {
      const text = String(value ?? "");
      return /^[=+\-@]/.test(text) ? `'${text}` : text;
    };
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "City",
        "Payment",
        "Joined",
        "Membership ends",
      ],
      ...filtered.map((member) => [
        member.fullName,
        member.email,
        member.phone,
        member.city,
        member.paymentStatus,
        member.membershipStartsOn ?? member.joinedAt,
        member.membershipEndsOn,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${safe(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cornerstone-membership-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!data)
    return (
      <section className="members-loading">
        <span className="members-spinner" />
        <p>
          {loading
            ? "Loading members…"
            : notice || "Members could not be loaded."}
        </p>
        {!loading && <button onClick={() => void load()}>Try again</button>}
      </section>
    );

  return (
    <section className="members-page mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
      <header className="members-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--event-accent)]">
            Community
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--event-heading)]">
            Members
          </h1>
          <span className="mt-2 text-sm text-[#716B75]">
            Members, applications, payments, and renewals.
          </span>
        </div>
        <div className="members-actions">
          <label>
            <Search size={17} />
            <span className="sr-only">Search members</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search members…"
            />
          </label>
          <button onClick={exportCsv}>
            <Download size={17} /> Export CSV
          </button>
        </div>
      </header>
      {notice && (
        <p role="status" className="members-notice">
          {notice}
        </p>
      )}
      <div className="members-stats">
        <article>
          <Users />
          <div>
            <span>Active members</span>
            <strong>{paidMembers.length}</strong>
          </div>
        </article>
        <article>
          <Clock3 />
          <div>
            <span>Expiring soon</span>
            <strong>{expiringSoon}</strong>
          </div>
        </article>
        <article>
          <Mail />
          <div>
            <span>Renewal reminders</span>
            <strong>{renewalReminders}</strong>
          </div>
        </article>
      </div>
      <div className="members-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Membership</th>
              <th>Joined</th>
              <th>Ends</th>
              <th>Reminder</th>
              <th>City</th>
              <th>
                <span className="sr-only">Open details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((member) => (
              <tr key={member.applicationId}>
                <td>
                  <span className="member-avatar">
                    {initials(member.fullName)}
                  </span>
                  <span>
                    <b>{member.fullName}</b>
                    <small>{member.email}</small>
                  </span>
                </td>
                <td>
                  <PaymentBadge status={member.paymentStatus} />
                  <small>Annual membership</small>
                </td>
                <td>
                  {formatDate(member.membershipStartsOn ?? member.joinedAt)}
                </td>
                <td>{formatDate(member.membershipEndsOn)}</td>
                <td>
                  {member.renewalReminderSentAt ? (
                    `Prepared ${formatDate(member.renewalReminderSentAt)}`
                  ) : member.membershipEndsOn ? (
                    <button
                      className="member-link"
                      onClick={() => void prepareReminder(member)}
                    >
                      Prepare
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{member.city}</td>
                <td>
                  <button
                    className="member-open"
                    onClick={() => choose(member)}
                    aria-label={`View ${member.fullName} details`}
                  >
                    <ChevronRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="members-empty">No paid members match your search.</p>
        )}
        {filtered.length > 0 && (
          <footer className="members-pagination">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div>
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((value) => value - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft />
              </button>
              <b>{currentPage}</b>
              <span>of {pages}</span>
              <button
                disabled={currentPage === pages}
                onClick={() => setPage((value) => value + 1)}
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
            </div>
          </footer>
        )}
      </div>
      {selected && (
        <div
          className="member-drawer-backdrop"
          onClick={() => setSelected(null)}
        >
          <aside
            className="member-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-drawer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButton}
              className="member-close"
              onClick={() => setSelected(null)}
              aria-label="Close member details"
            >
              <X />
            </button>
            <h2 id="member-drawer-title">{selected.fullName}</h2>
            <div className="member-drawer-status">
              <PaymentBadge status={selected.paymentStatus} />
              {selected.paymentStatus === "PAID" && <span>· Active</span>}
            </div>
            <Detail title="Contact">
              <Info label="Email" value={selected.email} />
              <Info label="Phone" value={selected.phone ?? "—"} />
              <Info label="City" value={selected.city} />
            </Detail>
            <Detail title="Membership">
              <Info label="Plan" value="Annual Membership" />
              <Info
                label="Amount"
                value={money.format(selected.amountCents / 100)}
              />
              <Info
                label="Joined"
                value={formatDate(
                  selected.membershipStartsOn ?? selected.joinedAt,
                )}
              />
              <Info
                label="Ends"
                value={formatDate(selected.membershipEndsOn)}
              />
            </Detail>
            <Detail title="Interests">
              <div className="member-tags">
                {selected.activities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <Info
                label="Agreement"
                value={
                  selected.membershipAgreementAccepted
                    ? "Acknowledged"
                    : "Not acknowledged"
                }
              />
              <Info
                label="Photography"
                value={
                  selected.photographyNoticeAcknowledged
                    ? "Acknowledged"
                    : "Not acknowledged"
                }
              />
              <Info label="Comments" value={selected.comments ?? "—"} />
              <Info label="Agreement version" value={selected.membershipAgreementVersion ?? "Legacy record"} />
              <Info label="Agreement accepted" value={formatDate(selected.membershipAgreementAcceptedAt)} />
            </Detail>
            <Detail title="Internal notes">
              <label className="member-notes">
                <span className="sr-only">Internal notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  maxLength={5000}
                />
                <button onClick={() => void saveNotes()}>Save notes</button>
              </label>
            </Detail>
            <div className="member-drawer-footer">
              {selected.paymentStatus === "PAID" && !selected.welcomeEmailSentAt && (
                <button onClick={() => void sendWelcomeEmail()}><Mail size={16} /> Send welcome email</button>
              )}
              {selected.membershipEndsOn && (
                <button onClick={() => void prepareReminder(selected)}>
                  <Mail size={16} /> Prepare renewal reminder
                </button>
              )}
              <a href={`mailto:${selected.email}`}>
                <Mail size={16} /> Email member
              </a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function Detail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="member-detail">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="member-info">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
