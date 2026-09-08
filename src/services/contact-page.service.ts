import { defaultContactContent, type ContactContent } from "@/lib/contact-content";
import { prepareImageUpload } from "@/lib/prepare-image-upload";
const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function check(response: Response) {
  if (response.ok) return;
  if (response.status === 401) throw new Error("The Contact admin token is incorrect.");
  if (response.status === 404) throw new Error("Deploy the updated backend to enable Contact page editing.");
  throw new Error(`Unable to complete the request (${response.status}).`);
}
export async function getContactContent(): Promise<ContactContent> {
  const response = await fetch(`${api}/api/v1/contact-page`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  await check(response); return response.status === 204 ? structuredClone(defaultContactContent) : response.json();
}
export async function saveContactContent(content: ContactContent): Promise<ContactContent> {
  const response = await fetch("/api/admin/contact-page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
  await check(response); return response.json();
}
export async function uploadContactPhoto(file: File): Promise<string> {
  const form = new FormData(); form.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/contact-page/image", { method: "POST", body: form }); await check(response);
  const result = await response.json(); return result.url;
}
