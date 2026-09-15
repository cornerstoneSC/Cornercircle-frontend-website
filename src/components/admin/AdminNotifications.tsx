"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getAdminDashboard, type AttentionItem } from "@/services/admin-dashboard.service";
import { usePathname } from "next/navigation";

type NotificationState = {
  notifications: AttentionItem[];
  affectedCount: number;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationState | null>(null);

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AttentionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await getAdminDashboard();
      setNotifications(data.attentionItems);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load notifications.");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 60_000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh, pathname]);

  const affectedCount = notifications.reduce((total, item) => total + item.affectedCount, 0);
  return (
    <NotificationsContext.Provider value={{ notifications, affectedCount, loading, error, refresh }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useAdminNotifications must be used within AdminNotificationsProvider");
  return value;
}
