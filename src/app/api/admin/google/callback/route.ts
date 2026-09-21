import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSession } from "@/lib/admin-session";

const STATE_COOKIE = "csc_google_oauth_state";
const NEXT_COOKIE = "csc_google_oauth_next";

function equal(left: string, right: string) {
  const expected = Buffer.from(left);
  const supplied = Buffer.from(right);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function loginError(request: Request, message: string) {
  const url = new URL("/admin-login", request.url);
  url.searchParams.set("error", message);
  return url.toString();
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value || "";
  const suppliedState = requestUrl.searchParams.get("state") || "";
  const code = requestUrl.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const clearCookies = [
    `${STATE_COOKIE}=; HttpOnly; SameSite=Lax; Path=/api/admin/google; Max-Age=0${secure}`,
    `${NEXT_COOKIE}=; HttpOnly; SameSite=Lax; Path=/api/admin/google; Max-Age=0${secure}`,
  ];

  if (!clientId || !clientSecret || !expectedState || !suppliedState || !equal(expectedState, suppliedState) || !code) {
    const headers = new Headers({ Location: loginError(request, "Google sign-in could not be verified. Please try again.") });
    clearCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return new Response(null, { status: 303, headers });
  }

  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || new URL("/api/admin/google/callback", requestUrl.origin).toString();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenResponse.ok) throw new Error("token exchange failed");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("access token missing");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!profileResponse.ok) throw new Error("profile lookup failed");
    const profile = await profileResponse.json() as { email?: string; email_verified?: boolean };
    const allowed = (process.env.GOOGLE_ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    if (!profile.email_verified || !profile.email || !allowed.includes(profile.email.toLowerCase())) {
      const headers = new Headers({ Location: loginError(request, "This Google account is not authorized for administrator access.") });
      clearCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
      return new Response(null, { status: 303, headers });
    }

    const configuredOwners = (process.env.GOOGLE_OWNER_EMAILS || allowed[0] || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const role = configuredOwners.includes(profile.email.toLowerCase()) ? "owner" : "admin";
    const session = await createAdminSession(ADMIN_SESSION_MAX_AGE, role);
    if (!session) throw new Error("session security is not configured");
    const storedNext = decodeURIComponent(cookieStore.get(NEXT_COOKIE)?.value || "");
    const destination = storedNext.startsWith("/admin") && !storedNext.startsWith("//") ? storedNext : "/admin/members";
    const headers = new Headers({ Location: new URL(destination, request.url).toString() });
    // The administrator is returning from accounts.google.com. A Lax cookie is
    // required so the new session is available throughout that top-level OAuth
    // redirect chain; Strict can send the user straight back to the login page.
    headers.append("Set-Cookie", `${ADMIN_SESSION_COOKIE}=${session}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${ADMIN_SESSION_MAX_AGE}${secure}`);
    clearCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return new Response(null, { status: 303, headers });
  } catch {
    const headers = new Headers({ Location: loginError(request, "Google sign-in is temporarily unavailable. Please use your password.") });
    clearCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return new Response(null, { status: 303, headers });
  }
}
