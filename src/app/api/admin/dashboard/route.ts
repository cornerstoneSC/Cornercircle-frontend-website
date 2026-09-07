import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
const backend=process.env.BACKEND_API_URL||process.env.NEXT_PUBLIC_API_URL||"http://localhost:8080";
export async function GET(){
 const cookieStore=await cookies();
 if(!await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value))return Response.json({message:"Admin sign-in required."},{status:401});
 const token=process.env.MEMBERSHIP_ADMIN_TOKEN;
 if(!token||token.length<32)return Response.json({message:"Dashboard administration is not configured."},{status:503});
 try{const response=await fetch(`${backend}/api/v1/admin/dashboard`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(10000)});return new Response(response.body,{status:response.status,headers:{"Content-Type":response.headers.get("Content-Type")||"application/json"}});}catch{return Response.json({message:"The dashboard service is temporarily unavailable."},{status:503});}
}
