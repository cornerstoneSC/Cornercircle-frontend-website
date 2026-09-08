import { defaultMembershipContent, type MembershipContent } from "@/lib/membership-content";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function check(response: Response) {
  if (response.ok) return;
  let message = "";
  try { const body = await response.clone().json() as { message?: string; detail?: string }; message = body.message || body.detail || ""; } catch { /* use fallback */ }
  if (response.status === 401) throw new Error("The Membership admin token is incorrect.");
  if (response.status === 503) throw new Error("Configure MEMBERSHIP_ADMIN_TOKEN on the backend before saving (at least 32 characters).");
  if (response.status === 404) throw new Error("Restart the updated backend to enable Membership editing.");
  throw new Error(message || `Unable to complete the request (${response.status}). Your changes have not been published.`);
}

export async function getMembershipContent(): Promise<MembershipContent> {
  const response = await fetch(`${api}/api/v1/membership-page`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  await check(response);
  if (response.status === 204) return structuredClone(defaultMembershipContent);
  const saved = await response.json() as Partial<MembershipContent>;
  return { ...structuredClone(defaultMembershipContent), ...saved };
}

export async function saveMembershipContent(content: MembershipContent): Promise<MembershipContent> {
  const response = await fetch("/api/admin/membership-page", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  await check(response);
  return response.json();
}
