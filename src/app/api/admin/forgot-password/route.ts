type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now(), previous = attempts.get(key);
  if (previous && previous.resetAt > now && previous.count >= 3) return Response.json({ message: "Too many reset requests. Try again later." }, { status: 429 });
  attempts.set(key, { count: previous && previous.resetAt > now ? previous.count + 1 : 1, resetAt: previous && previous.resetAt > now ? previous.resetAt : now + 15 * 60 * 1000 });
  const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32) return Response.json({ message: "Password reset is not configured." }, { status: 503 });
  const body = await request.text();
  try {
    const response = await fetch(`${backend}/api/v1/admin/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json", "X-Admin-Auth-Token": token }, body, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) return Response.json({ message: "Password reset is temporarily unavailable." }, { status: 503 });
    return new Response(null, { status: 204 });
  } catch { return Response.json({ message: "Password reset is temporarily unavailable." }, { status: 503 }); }
}
