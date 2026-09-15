import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
async function forward(request:Request,context:{params:Promise<{segments?:string[]}>}){
  const cookieStore=await cookies();if(!await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))return Response.json({message:"Admin sign-in required."},{status:401});
  const token=process.env.SERVICES_ADMIN_TOKEN;if(!token||token.length<32)return Response.json({message:"Services administration is not configured."},{status:503});
  const{segments=[]}=await context.params;if(segments.length>1)return Response.json({message:"Not found."},{status:404});
  try{const response=await fetch(`${backend}/api/v1/service-consultations/admin${segments[0]?`/${encodeURIComponent(segments[0])}`:""}`,{method:request.method,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:request.method==="GET"?undefined:await request.text(),cache:"no-store",signal:AbortSignal.timeout(15000)});return new Response(response.body,{status:response.status,headers:{"Content-Type":response.headers.get("Content-Type")||"application/json"}})}catch{return Response.json({message:"Services administration is temporarily unavailable."},{status:503})}
}
export const GET=forward;export const PATCH=forward;
