"use client";

import NotificationBell from "@/components/admin/NotificationBell";
import { usePathname } from "next/navigation";

const pageTitles: Array<[string, string]> = [
  ["/admin/event-registrations", "Event registrations"],
  ["/admin/event-policy", "Event policy"],
  ["/admin/administrators", "Administrators"],
  ["/admin/check-in", "Ticket check-in"],
  ["/admin/membership", "Membership page"],
  ["/admin/newsletter", "Newsletter"],
  ["/admin/homepage", "Homepage editor"],
  ["/admin/services", "Services editor"],
  ["/admin/contact", "Contact editor"],
  ["/admin/founder", "Founder editor"],
  ["/admin/members", "Members"],
  ["/admin/events", "Events"],
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = pageTitles.find(([path]) => pathname.startsWith(path))?.[1] ?? "Dashboard";
  return (
    <header className="hidden min-h-16 items-center gap-4 border-b border-[var(--event-border)] bg-[var(--event-surface)] px-7 md:flex">
      <div className="mr-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[var(--event-muted)]">Admin workspace</p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--event-heading)]">{title}</p>
      </div>
      <NotificationBell />
    </header>
  );
}
