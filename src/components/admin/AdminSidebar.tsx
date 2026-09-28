"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("cornerstone-admin-sidebar-collapsed") === "true");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("cornerstone-admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`relative hidden h-screen shrink-0 flex-col border-r border-[var(--event-border)] bg-[var(--event-canvas)] transition-[width] duration-200 md:flex ${collapsed ? "w-[76px]" : "w-[280px]"}`}>
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
        aria-expanded={!collapsed}
        className="absolute -right-3 top-[76px] z-50 grid h-7 w-7 place-items-center rounded-full border border-[var(--event-border)] bg-[var(--event-surface)] text-[var(--event-muted)] shadow-sm transition hover:border-[var(--event-accent-strong)] hover:text-[var(--event-accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--event-accent-strong)]"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
      </button>
      {/* Logo */}
      <div className={`border-b border-[var(--event-border)] bg-[var(--event-surface)] py-3 ${collapsed ? "px-2" : "px-5"}`}>
        <Link
          href="/admin"
          className={`flex items-center rounded-[var(--event-radius-sm)] transition hover:bg-[var(--event-accent-soft)] ${collapsed ? "justify-center px-0" : "gap-2.5 px-2.5"}`}
          aria-label="Cornerstone admin dashboard"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[var(--event-accent-strong)] bg-[var(--event-accent-strong)] p-[2px] shadow-[0_2px_8px_rgba(126,91,29,.12)]">
            <span className="grid h-full w-full place-items-center border border-[var(--event-accent-soft)] font-serif text-[15px] font-normal text-white">
              CS
            </span>
          </span>
          <span className={`font-serif text-base tracking-[0.06em] text-[var(--event-heading)] ${collapsed ? "hidden" : "block"}`}>
            CORNERSTONE
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className={`flex-1 overflow-y-auto py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${collapsed ? "px-2" : "px-4"}`}>
        <nav className="space-y-7">
          {navGroups.filter((group) => owner || group.label !== "Security").map((group) => (
            <section key={group.label}>
              <p className={`mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--event-muted)] ${collapsed ? "sr-only" : "block"}`}>
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>
      </div>

      {/* Session */}
      <div className={`border-t border-[var(--event-border)] bg-[var(--event-surface)] ${collapsed ? "p-2" : "p-4"}`}>
        <div className={`flex items-center px-1 ${collapsed ? "mb-2 justify-center" : "mb-3 gap-3"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--event-accent-soft)] font-semibold text-[var(--event-accent-strong)]">
            CS
          </div>
          <div className={`min-w-0 ${collapsed ? "hidden" : "block"}`}>
            <p className="truncate text-sm font-semibold text-[var(--event-heading)]">
              Admin workspace
            </p>
            <p className="text-xs text-[var(--event-muted)]">Secure session</p>
          </div>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className={`flex min-h-11 w-full items-center justify-center rounded-[var(--event-radius-sm)] border border-[var(--event-border)] bg-[var(--event-canvas)] py-2.5 text-sm font-semibold text-[var(--event-heading)] transition hover:border-[var(--event-accent-strong)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)] ${collapsed ? "px-2" : "gap-2 px-4"}`}
            aria-label="Log out of the admin workspace"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className={collapsed ? "sr-only" : "inline"}>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={`group flex items-center rounded-[var(--event-radius-sm)] py-2.5 text-sm font-medium transition-all ${collapsed ? "justify-center px-2" : "gap-3 px-4"} ${active ? "bg-[var(--event-accent-soft)] text-[var(--event-accent-strong)]" : "text-[var(--event-text)] hover:bg-[var(--event-accent-soft)] hover:text-[var(--event-accent-strong)]"}`}
    >
      <Icon
        className={`h-5 w-5 ${active ? "text-[var(--event-accent-strong)]" : "text-[var(--event-muted)] group-hover:text-[var(--event-accent-strong)]"}`}
      />
      <span className={collapsed ? "sr-only" : "inline"}>{item.label}</span>
    </Link>
  );
}
