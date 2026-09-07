const backend =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

async function forward(
  request: Request,
  context: { params: Promise<{ slug: string; segments?: string[] }> },
) {
  const { slug, segments = [] } = await context.params;
  const suffix = segments.length
    ? `/${segments.map(encodeURIComponent).join("/")}`
    : "";
  try {
    const response = await fetch(
      `${backend}/api/v1/events/${encodeURIComponent(slug)}/registrations${suffix}`,
      {
        method: request.method,
        headers:
          request.method === "POST"
            ? { "Content-Type": "application/json" }
            : undefined,
        body: request.method === "POST" ? await request.text() : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
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
      { message: "Registration is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
