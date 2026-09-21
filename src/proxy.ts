import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminOwnerSession, verifyAdminSession } from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  if (["/api/admin/login", "/api/admin/forgot-password", "/api/admin/reset-password", "/api/admin/google", "/api/admin/google/callback"].includes(request.nextUrl.pathname)) return NextResponse.next();
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSession(session);
  const administratorManagement = request.nextUrl.pathname.startsWith("/admin/administrators") || request.nextUrl.pathname.startsWith("/api/admin/administrators");
  if (valid && administratorManagement && !(await verifyAdminOwnerSession(session))) {
    if (request.nextUrl.pathname.startsWith("/api/admin/")) return Response.json({ message: "Owner access is required." }, { status: 403 });
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (valid) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/admin/")) return Response.json({ message: "Admin sign-in required." }, { status: 401 });
  const login = new URL("/admin-login", request.url);
  login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
