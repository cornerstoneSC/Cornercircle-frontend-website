import { defaultServicesContent, type ServicesContent } from "@/lib/services-content";
import { prepareImageUpload } from "@/lib/prepare-image-upload";
const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function check(response: Response) {
  if (response.ok) return;
  if (response.status === 401) throw new Error("The Services admin token is incorrect.");
  if (response.status === 503) throw new Error("Configure SERVICES_ADMIN_TOKEN on the backend before saving (at least 32 characters).");
  if (response.status === 404) throw new Error("Restart the backend to enable the new Services editor endpoints.");
  throw new Error(`Unable to complete the request (${response.status}). Your changes have not been published.`);
}

export async function getServicesContent(): Promise<ServicesContent> {
  const response = await fetch(`${api}/api/v1/services-page`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  await check(response);
  if (response.status === 204) return structuredClone(defaultServicesContent);
  return response.json();
}

export async function saveServicesContent(content: ServicesContent): Promise<ServicesContent> {
  const response = await fetch("/api/admin/services-page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
  await check(response); return response.json();
}

export async function uploadServicesPhoto(file: File): Promise<string> {
  const form = new FormData(); form.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/services-page/image", { method: "POST", body: form });
  await check(response);
  const result = await response.json();
  if (typeof result.url !== "string" || !result.url.startsWith("https://")) throw new Error("The upload did not return a valid image URL.");
  return result.url;
}
