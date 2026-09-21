import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminOwnerSession } from "@/lib/admin-session";

export async function GET() {
  const store = await cookies();
  const owner = await verifyAdminOwnerSession(store.get(ADMIN_SESSION_COOKIE)?.value);
  return Response.json({ owner });
}
