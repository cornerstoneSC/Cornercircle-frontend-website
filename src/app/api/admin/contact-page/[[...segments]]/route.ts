const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
async function forward(request: Request, context: { params: Promise<{ segments?: string[] }> }) {
  const token = process.env.SERVICES_ADMIN_TOKEN;
  if (!token || token.length < 32) return Response.json({ message: "Contact publishing is not configured." }, { status: 503 });
  const { segments = [] } = await context.params;
  if (segments.length > 1 || (segments[0] && segments[0] !== "image")) return Response.json({ message: "Not found." }, { status: 404 });
  try {
    const response = await fetch(`${backend}/api/v1/admin/contact-page${segments[0] ? "/image" : ""}`, { method: request.method, headers: { Authorization: `Bearer ${token}`, "Content-Type": request.headers.get("Content-Type") || "application/json" }, body: await request.arrayBuffer(), cache: "no-store", signal: AbortSignal.timeout(30000) });
    return new Response(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" } });
  } catch { return Response.json({ message: "Contact publishing is temporarily unavailable." }, { status: 503 }); }
}
export const PUT = forward;
export const POST = forward;
