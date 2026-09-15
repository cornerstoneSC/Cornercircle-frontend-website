import NotificationBell from "@/components/admin/NotificationBell";

export default function AdminTopbar() {
  return (
    <header className="hidden md:flex items-center justify-end gap-3 border-b border-[var(--event-border)] bg-[var(--event-surface)] px-6 py-3">
      <NotificationBell />
    </header>
  );
}
