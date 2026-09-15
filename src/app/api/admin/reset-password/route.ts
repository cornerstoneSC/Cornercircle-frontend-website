export async function POST(request: Request) {
  const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token = process.env.MEMBERSHIP_ADMIN_TOKEN;
  if (!token || token.length < 32) return Response.json({ message: "Password reset is not configured." }, { status: 503 });
  const body = await request.text();
  try {
    const response = await fetch(`${backend}/api/v1/admin/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json", "X-Admin-Auth-Token": token }, body, cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (response.status === 400) return Response.json({ message: "This reset link is invalid or has expired." }, { status: 400 });
    if (!response.ok) return Response.json({ message: "Password reset is temporarily unavailable." }, { status: 503 });
    return new Response(null, { status: 204 });
  } catch { return Response.json({ message: "Password reset is temporarily unavailable." }, { status: 503 }); }
}
