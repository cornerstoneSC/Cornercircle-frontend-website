const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export async function POST(request: Request) {
  try { const response = await fetch(`${backend}/api/v1/service-consultations`, { method:"POST",headers:{"Content-Type":"application/json"},body:await request.text(),cache:"no-store",signal:AbortSignal.timeout(15000) }); return new Response(response.body,{status:response.status,headers:{"Content-Type":response.headers.get("Content-Type")||"application/json"}}); }
  catch { return Response.json({message:"Consultation requests are temporarily unavailable."},{status:503}); }
}
