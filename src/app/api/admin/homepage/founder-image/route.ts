import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)))
    return Response.json(
      { message: "Admin sign-in required." },
      { status: 401 },
    );
  const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!apiUrl || !secret)
    return Response.json(
      { message: "Homepage editing is not configured." },
      { status: 503 },
    );
  const response = await fetch(
    `${apiUrl}/api/v1/admin/homepage/founder/image`,
    {
      method: "POST",
      headers: { "X-Admin-Content-Secret": secret },
      body: await request.formData(),
    },
  );
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") || "application/json",
    },
  });
}
