"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  House,
  HeartHandshake,
  CalendarDays,
  ClipboardList,
  FileText,
  UserRound,
  Users,
  Mail,
  MessageSquareText,
  LogOut,
  ScanLine,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import useAdminOwner from "@/hooks/useAdminOwner";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Community",
    items: [
      { label: "Members", href: "/admin/members", icon: Users },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      {
        label: "Event Registrations",
        href: "/admin/event-registrations",
        icon: ClipboardList,
      },
      { label: "Ticket Check-in", href: "/admin/check-in", icon: ScanLine },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Consultations", href: "/admin/service-consultations", icon: CalendarCheck },
    ],
  },
  {
    label: "Security",
    items: [{ label: "Administrators", href: "/admin/administrators", icon: ShieldCheck }],
  },
  {
    label: "Website",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: House },
      { label: "Founder Page", href: "/admin/founder", icon: UserRound },
      { label: "Membership Page", href: "/admin/membership", icon: Users },
      { label: "Services Page", href: "/admin/services", icon: HeartHandshake },
      { label: "Contact Page", href: "/admin/contact", icon: MessageSquareText },
      { label: "Event Policy", href: "/admin/event-policy", icon: FileText },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const owner = useAdminOwner();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex h-screen w-[280px] shrink-0 flex-col border-r border-[var(--event-border)] bg-[var(--event-canvas)]">
      {/* Logo */}
      <div className="border-b border-[var(--event-border)] bg-[var(--event-surface)] px-5 py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 rounded-[var(--event-radius-sm)] px-2.5 transition hover:bg-[var(--event-accent-soft)]"
          aria-label="Cornerstone admin dashboard"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[var(--event-accent-strong)] bg-[var(--event-accent-strong)] p-[2px] shadow-[0_2px_8px_rgba(126,91,29,.12)]">
            <span className="grid h-full w-full place-items-center border border-[var(--event-accent-soft)] font-serif text-[15px] font-normal text-white">
              CS
            </span>
          </span>
          <span className="font-serif text-base tracking-[0.06em] text-[var(--event-heading)]">
            CORNERSTONE
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-7">
          {navGroups.filter((group) => owner || group.label !== "Security").map((group) => (
            <section key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--event-muted)]">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>
      </div>

      {/* Session */}
      <div className="border-t border-[var(--event-border)] bg-[var(--event-surface)] p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--event-accent-soft)] font-semibold text-[var(--event-accent-strong)]">
            CS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--event-heading)]">
              Admin workspace
            </p>
            <p className="text-xs text-[var(--event-muted)]">Secure session</p>
          </div>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--event-radius-sm)] border border-[var(--event-border)] bg-[var(--event-canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--event-heading)] transition hover:border-[var(--event-accent-strong)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)]"
            aria-label="Log out of the admin workspace"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-[var(--event-radius-sm)] px-4 py-2.5 text-sm font-medium transition-all ${active ? "bg-[var(--event-accent-soft)] text-[var(--event-accent-strong)]" : "text-[var(--event-text)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)]"}`}
    >
      <Icon
        className={`h-5 w-5 ${active ? "text-[var(--event-accent-strong)]" : "text-[var(--event-muted)] group-hover:text-[var(--event-accent-strong)]"}`}
      />
      <span>{item.label}</span>
    </Link>
  );
}
