import { timingSafeEqual } from "node:crypto";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "@/lib/admin-session";

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
  const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!equal(configuredUsername, username) || !equal(configuredPassword, password)) {
    return Response.json({ message: "The username or password is incorrect." }, { status: 401 });
  }
  const session = await createAdminSession();
  if (!session) return Response.json({ message: "Admin session security is not configured." }, { status: 503 });
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NODE_ENV === "production" ? "; Secure" : ""}` },
  });
}
