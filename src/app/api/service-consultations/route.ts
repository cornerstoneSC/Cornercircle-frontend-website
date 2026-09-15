const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const windowMs=15*60*1000,limit=5,maxBodyBytes=20_000;
const attempts=new Map<string,{count:number;resetAt:number}>();
export async function POST(request: Request) {
  const now=Date.now(),ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"unknown";
  if(attempts.size>1000)for(const[key,value]of attempts)if(value.resetAt<=now)attempts.delete(key);
  const current=attempts.get(ip);if(current&&current.resetAt>now&&current.count>=limit)return Response.json({message:"Too many consultation requests. Please wait before trying again."},{status:429,headers:{"Retry-After":String(Math.ceil((current.resetAt-now)/1000))}});
  attempts.set(ip,current&&current.resetAt>now?{...current,count:current.count+1}:{count:1,resetAt:now+windowMs});
  try { const body=await request.text();if(new TextEncoder().encode(body).length>maxBodyBytes)return Response.json({message:"Consultation request is too large."},{status:413});const response = await fetch(`${backend}/api/v1/service-consultations`, { method:"POST",headers:{"Content-Type":"application/json"},body,cache:"no-store",signal:AbortSignal.timeout(15000) }); return new Response(response.body,{status:response.status,headers:{"Content-Type":response.headers.get("Content-Type")||"application/json"}}); }
  catch { return Response.json({message:"Consultation requests are temporarily unavailable."},{status:503}); }
}
