const backend =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32)
    return Response.json(
      { message: "Newsletter administration is not configured." },
      { status: 503 },
    );
  const { id } = await params;
  if (!/^\d+$/.test(id))
    return Response.json({ message: "Invalid subscriber." }, { status: 400 });
  try {
    const response = await fetch(
      `${backend}/api/v1/newsletter/admin/subscribers/${id}/retry`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Newsletter service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
