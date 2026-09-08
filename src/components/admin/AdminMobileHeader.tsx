"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  HeartHandshake,
  House,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareText,
  Menu,
  Users,
  UserRound,
} from "lucide-react";

const groups = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Community",
    links: [
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/events", label: "Events", icon: CalendarDays },
      {
        href: "/admin/event-registrations",
        label: "Event Registrations",
        icon: ClipboardList,
      },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    label: "Website",
    links: [
      { href: "/admin/homepage", label: "Homepage", icon: House },
      { href: "/admin/founder", label: "Founder Page", icon: UserRound },
      { href: "/admin/membership", label: "Membership Page", icon: Users },
      { href: "/admin/services", label: "Services Page", icon: HeartHandshake },
      { href: "/admin/contact", label: "Contact Page", icon: MessageSquareText },
      { href: "/admin/event-policy", label: "Event Policy", icon: FileText },
    ],
  },
];

export default function AdminMobileHeader() {
  return (
    <header className="relative z-50 flex items-center justify-between border-b border-[var(--event-border)] bg-[var(--event-canvas)] px-5 py-4 md:hidden">
      <Link
        href="/admin"
        className="flex items-center gap-2.5"
        aria-label="Cornerstone admin dashboard"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[var(--event-accent-strong)] bg-[var(--event-accent-strong)] p-[2px]">
          <span className="grid h-full w-full place-items-center border border-[var(--event-accent-soft)] font-serif text-[13px] font-normal text-white">
            CS
          </span>
        </span>
        <span className="font-serif text-lg tracking-[0.08em] text-[var(--event-heading)]">
          CORNERSTONE
        </span>
      </Link>

      <details className="group">
        <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[var(--event-radius-sm)] border border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-text)]">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open admin navigation</span>
        </summary>

        <nav className="absolute inset-x-4 top-[68px] max-h-[calc(100vh-84px)] overflow-y-auto rounded-[var(--event-radius-md)] border border-[var(--event-border)] bg-[var(--event-surface)] p-3 shadow-xl">
          {groups.map((group) => (
            <section key={group.label} className="mb-3">
              <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[var(--event-muted)]">
                {group.label}
              </p>
              {group.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-[var(--event-radius-sm)] px-4 py-2.5 text-sm font-medium text-[var(--event-text)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)]"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </section>
          ))}
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[var(--event-radius-sm)] px-4 py-3 text-sm font-medium text-[var(--event-text)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </nav>
      </details>
    </header>
  );
}
