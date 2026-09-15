import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AdminNotificationsProvider } from "@/components/admin/AdminNotifications";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminNotificationsProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminMobileHeader />
          <AdminTopbar />
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </AdminNotificationsProvider>
  );
}
