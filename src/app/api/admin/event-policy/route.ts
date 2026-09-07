import { defaultEventPolicy } from "@/app/(public)/event-terms/page";

const backend =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function GET() {
  try {
    const response = await fetch(`${backend}/api/v1/event-policy`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 204) return Response.json(defaultEventPolicy);
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(defaultEventPolicy);
  }
}

export async function PUT(request: Request) {
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32)
    return Response.json(
      { message: "Event policy editing is not configured." },
      { status: 503 },
    );
  try {
    const response = await fetch(`${backend}/api/v1/admin/event-policy`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Event policy service is unavailable." },
      { status: 503 },
    );
  }
}
