import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/admin/login") return NextResponse.next();
  const valid = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (valid) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/admin/")) return Response.json({ message: "Admin sign-in required." }, { status: 401 });
  const login = new URL("/admin-login", request.url);
  login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
