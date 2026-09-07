"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Bell } from "lucide-react";
import { getAdminDashboard, type DashboardData } from "@/services/admin-dashboard.service";

export default function AdminTopbar() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = data?.attentionItems ?? [];
  const count = notifications.length;

  return (
    <header className="hidden md:flex items-center justify-end gap-3 border-b border-[var(--event-border)] bg-[var(--event-surface)] px-6 py-3">
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-10 w-10 items-center justify-center rounded-[var(--event-radius-sm)] border border-[var(--event-border)] bg-[var(--event-canvas)] text-[var(--event-text)] transition hover:border-[var(--event-accent-strong)] hover:text-[var(--event-accent-strong)]"
          aria-label="Notifications"
          aria-expanded={open}
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--event-danger)] px-1 text-[10px] font-semibold text-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 rounded-[var(--event-radius-md)] border border-[var(--event-border)] bg-[var(--event-surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--event-border)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--event-heading)]">Notifications</p>
              {count > 0 && (
                <span className="text-xs text-[var(--event-muted)]">{count} need attention</span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-[var(--event-muted)]">
                  You&apos;re all caught up.
                </p>
              ) : (
                notifications.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 border-b border-[var(--event-border)] px-4 py-3 text-left transition last:border-b-0 hover:bg-[var(--event-accent-soft)]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent-strong)]" />
                    <span>
                      <span className="block text-sm font-medium text-[var(--event-heading)]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--event-muted)]">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
