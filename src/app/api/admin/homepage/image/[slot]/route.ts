import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

const allowedSlots = new Set(["hero", "about", "beliefs", "newsletter"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const cookieStore = await cookies();
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))) {
    return Response.json({ message: "Admin sign-in required." }, { status: 401 });
  }

  const { slot } = await params;
  if (!allowedSlots.has(slot)) {
    return Response.json({ message: "Not found." }, { status: 404 });
  }

  const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!apiUrl || !secret || secret.length < 32) {
    return Response.json(
      { message: "Homepage image editing is not configured." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/admin/homepage/${slot}/image`,
      {
        method: "POST",
        headers: { "X-Admin-Content-Secret": secret },
        body: await request.formData(),
        signal: AbortSignal.timeout(30000),
      },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "Homepage image service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
