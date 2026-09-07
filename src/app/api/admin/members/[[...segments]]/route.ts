const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function forward(request: Request, context: { params: Promise<{ segments?: string[] }> }) {
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32) return Response.json({ message: "Members administration is not configured." }, { status: 503 });
  const { segments = [] } = await context.params;
  const uuid = /^[0-9a-f-]{36}$/i;
  const allowed = segments.length === 0 || segments.length === 1 && uuid.test(segments[0]) || segments.length === 2 && uuid.test(segments[0]) && ["renewal-reminder", "welcome-email", "notes"].includes(segments[1]);
  if (!allowed) return Response.json({ message: "Not found." }, { status: 404 });
  const incomingUrl = new URL(request.url);
  const target = `${backend}/api/v1/admin/members${segments.length ? `/${segments.join("/")}` : ""}${incomingUrl.search}`;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  try {
    const response = await fetch(target, { method: request.method, headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) }, body, cache: "no-store", signal: AbortSignal.timeout(10000) });
    return new Response(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" } });
  } catch { return Response.json({ message: "The member service is temporarily unavailable." }, { status: 503 }); }
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
