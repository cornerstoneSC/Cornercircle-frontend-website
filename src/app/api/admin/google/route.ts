import { randomBytes } from "node:crypto";

const STATE_COOKIE = "csc_google_oauth_state";
const NEXT_COOKIE = "csc_google_oauth_next";

function safeNext(value: string | null) {
  return value?.startsWith("/admin") && !value.startsWith("//") ? value : "/admin/members";
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_ADMIN_EMAILS) {
    return Response.json({ message: "Google sign-in is not configured." }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || new URL("/api/admin/google/callback", requestUrl.origin).toString();
  const state = randomBytes(32).toString("base64url");
  const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorization.searchParams.set("client_id", clientId);
  authorization.searchParams.set("redirect_uri", redirectUri);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("scope", "openid email profile");
  authorization.searchParams.set("state", state);
  authorization.searchParams.set("prompt", "select_account");

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const headers = new Headers({ Location: authorization.toString() });
  headers.append("Set-Cookie", `${STATE_COOKIE}=${state}; HttpOnly; SameSite=Lax; Path=/api/admin/google; Max-Age=600${secure}`);
  headers.append("Set-Cookie", `${NEXT_COOKIE}=${encodeURIComponent(safeNext(requestUrl.searchParams.get("next")))}; HttpOnly; SameSite=Lax; Path=/api/admin/google; Max-Age=600${secure}`);
  return new Response(null, { status: 302, headers });
}
