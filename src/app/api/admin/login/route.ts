import { timingSafeEqual } from "node:crypto";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "@/lib/admin-session";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const attemptWindowMs = 15 * 60 * 1000;
const maxAttempts = 5;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function equal(expected: string, supplied: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredUsername || !configuredPassword || configuredPassword.length < 8) {
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
  const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!equal(configuredUsername, username) || !equal(configuredPassword, password)) {
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
  const session = await createAdminSession();
  if (!session) return Response.json({ message: "Admin session security is not configured." }, { status: 503 });
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NODE_ENV === "production" ? "; Secure" : ""}` },
  });
}
