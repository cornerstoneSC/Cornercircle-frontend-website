const backend =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

async function forward(
  request: Request,
  context: { params: Promise<{ segments?: string[] }> },
) {
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32)
    return Response.json(
      { message: "Events administration is not configured." },
      { status: 503 },
    );
  const { segments = [] } = await context.params;
  const incoming = new URL(request.url);
  const path = segments.length
    ? `/${segments.map(encodeURIComponent).join("/")}`
    : "";
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  try {
    const response = await fetch(
      `${backend}/api/v1/admin/events${path}${incoming.search}`,
      {
        method: request.method,
        headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : await request.arrayBuffer(),
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      },
    );
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "The Events service is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
