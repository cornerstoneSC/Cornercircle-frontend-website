import "server-only";
import type { AdminEvent } from "@/types/admin-event";

const backend =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function getAdminEventServer(id: number): Promise<AdminEvent> {
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32)
    throw new Error("Events administration is not configured.");
  const response = await fetch(`${backend}/api/v1/admin/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(`Unable to load event (${response.status}).`);
  return response.json() as Promise<AdminEvent>;
}
