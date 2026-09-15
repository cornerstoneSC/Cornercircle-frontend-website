import { ADMIN_REMEMBERED_SESSION_MAX_AGE, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSession } from "@/lib/admin-session";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const attemptWindowMs = 15 * 60 * 1000;
const maxAttempts = 5;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const authToken = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!authToken || authToken.length < 32) {
    return Response.json({ message: "Admin sign-in is not configured." }, { status: 503 });
  }
  const key = clientKey(request);
  const now = Date.now();
  const previous = attempts.get(key);
  if (previous && previous.resetAt > now && previous.count >= maxAttempts) {
    return Response.json(
      { message: "Too many sign-in attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((previous.resetAt - now) / 1000)) } },
    );
  }
  if (previous && previous.resetAt <= now) attempts.delete(key);
  const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown; remember?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  let authenticated = false;
  try {
    const response = await fetch(`${backend}/api/v1/admin/auth/login`, { method: "POST", headers: { "Content-Type": "application/json", "X-Admin-Auth-Token": authToken }, body: JSON.stringify({ username, password }), cache: "no-store", signal: AbortSignal.timeout(10000) });
    authenticated = response.ok;
    if (response.status === 403) return Response.json({ message: "Frontend and backend admin security tokens do not match." }, { status: 503 });
    if (response.status >= 500) return Response.json({ message: "Admin sign-in is temporarily unavailable." }, { status: 503 });
  } catch { return Response.json({ message: "Admin sign-in is temporarily unavailable." }, { status: 503 }); }
  if (!authenticated) {
    const current = attempts.get(key);
    attempts.set(key, {
      count: (current?.count || 0) + 1,
      resetAt: current?.resetAt || now + attemptWindowMs,
    });
    if (attempts.size > 1000) {
      for (const [candidate, value] of attempts) {
        if (value.resetAt <= now) attempts.delete(candidate);
      }
    }
    return Response.json({ message: "The username or password is incorrect." }, { status: 401 });
  }
  attempts.delete(key);
  const maxAge = body?.remember === true ? ADMIN_REMEMBERED_SESSION_MAX_AGE : ADMIN_SESSION_MAX_AGE;
  const session = await createAdminSession(maxAge);
  if (!session) return Response.json({ message: "Admin session security is not configured." }, { status: 503 });
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}` },
  });
}
