"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Bell, RefreshCw } from "lucide-react";
import { useAdminNotifications } from "@/components/admin/AdminNotifications";

export default function NotificationBell() {
  const { notifications, affectedCount, loading, error, refresh } = useAdminNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    window.requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>("a, button");
      (focusable ?? panelRef.current)?.focus();
    });
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button ref={triggerRef} type="button" onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-[var(--event-radius-sm)] border border-[var(--event-border)] bg-[var(--event-canvas)] text-[var(--event-text)] transition hover:border-[var(--event-accent-strong)] hover:text-[var(--event-accent-strong)]"
        aria-label="Notifications" aria-expanded={open} aria-haspopup="dialog">
        <Bell className="h-5 w-5" />
        {affectedCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--event-danger)] px-1 text-[10px] font-semibold text-white">{affectedCount > 9 ? "9+" : affectedCount}</span>}
      </button>
      {open && (
        <div ref={panelRef} tabIndex={-1} role="dialog" aria-label="Notifications" className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--event-radius-md)] border border-[var(--event-border)] bg-[var(--event-surface)] shadow-xl outline-none">
          <div className="flex items-center justify-between border-b border-[var(--event-border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--event-heading)]">Notifications</p>
            {affectedCount > 0 && <span className="text-xs text-[var(--event-muted)]">{affectedCount} need attention</span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? <p className="px-4 py-6 text-center text-sm text-[var(--event-muted)]">Loading notifications…</p>
              : error ? <div className="px-4 py-5 text-center text-sm text-[var(--event-danger)]"><p>{error}</p><button className="mx-auto mt-3 flex items-center gap-2 text-[var(--event-accent-strong)]" onClick={() => void refresh()}><RefreshCw className="h-4 w-4" />Try again</button></div>
              : notifications.length === 0 ? <p className="px-4 py-6 text-center text-sm text-[var(--event-muted)]">You&apos;re all caught up.</p>
              : notifications.map((item) => <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="flex items-start gap-3 border-b border-[var(--event-border)] px-4 py-3 text-left transition last:border-b-0 hover:bg-[var(--event-accent-soft)]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--event-accent-strong)]" /><span><span className="block text-sm font-medium text-[var(--event-heading)]">{item.title}</span><span className="mt-0.5 block text-xs text-[var(--event-muted)]">{item.description}</span></span></Link>)}
          </div>
        </div>
      )}
    </div>
  );
}
