import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export async function POST(request: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/admin-login", request.url).toString(),
      "Set-Cookie": `${ADMIN_SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    },
  });
}
