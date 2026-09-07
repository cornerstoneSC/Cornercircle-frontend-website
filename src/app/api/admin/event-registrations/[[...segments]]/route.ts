import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function forward(request: Request, context: { params: Promise<{ segments?: string[] }> }) {
  const cookieStore = await cookies();
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)))
    return Response.json({ message: "Admin sign-in required." }, { status: 401 });
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32)
    return Response.json({ message: "Event registrations administration is not configured." }, { status: 503 });
  const { segments = [] } = await context.params;
  const suffix = segments.length ? `/${segments.map(encodeURIComponent).join("/")}` : "";
  const incoming = new URL(request.url);
  try {
    const response = await fetch(`${backend}/api/v1/admin/event-registrations${suffix}${incoming.search}`, {
      method: request.method,
      headers: { Authorization: `Bearer ${token}`, ...(request.method === "GET" ? {} : { "Content-Type": "application/json" }) },
      body: request.method === "GET" ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    return new Response(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" } });
  } catch {
    return Response.json({ message: "The registrations service is temporarily unavailable." }, { status: 503 });
  }
}

export const GET = forward;
export const POST = forward;
export const DELETE = forward;
