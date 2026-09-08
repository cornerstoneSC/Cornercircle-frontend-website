import type { HomepageContent } from "@/types/homepage";
import { prepareImageUpload } from "@/lib/prepare-image-upload";

export type HomepageResponse = {
  id: number;
  heroImageUrl: string;
  heroImagePublicId: string;
  aboutImageUrl: string;
  aboutImagePublicId: string;
  beliefsImageUrl?: string;
  beliefsImagePublicId?: string;
  founderImageUrl?: string;
  founderImagePublicId?: string;
  newsletterImageUrl?: string;
  newsletterImagePublicId?: string;
  contentJson?: string;
};

async function uploadError(response: Response, fallback: string) {
  const result = (await response.json().catch(() => null)) as
    | { message?: string; detail?: string }
    | null;
  return new Error(result?.message || result?.detail || `${fallback} (${response.status})`);
}

export async function getHomepage(): Promise<HomepageResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/homepage`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch homepage data");
  }
  return response.json();
}

export async function saveHomepageContent(
  content: HomepageContent,
): Promise<void> {
  const response = await fetch("/api/admin/homepage/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentJson: JSON.stringify(content) }),
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(result?.message || "Unable to save homepage content.");
  }
}

export async function uploadBeliefsImage(
  file: File,
): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/homepage/image/beliefs", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw await uploadError(response, "Failed to upload beliefs photo");
  const result: HomepageResponse = await response.json();
  if (!result.beliefsImageUrl)
    throw new Error("No saved beliefs photo returned");
  return result;
}

export async function uploadHeroImage(file: File): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));

  const response = await fetch("/api/admin/homepage/image/hero", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await uploadError(response, "Failed to upload hero image");
  }
  return response.json();
}

export async function uploadAboutImage(file: File): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));

  const response = await fetch("/api/admin/homepage/image/about", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await uploadError(response, "Failed to upload about image");
  }
  return response.json();
}

export async function uploadFounderImage(
  file: File,
): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/homepage/founder-image", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw await uploadError(response, "Failed to upload founder photo");
  return response.json();
}

export async function uploadNewsletterImage(
  file: File,
): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/homepage/image/newsletter", {
    method: "POST",
    body: formData,
  });
  if (!response.ok)
    throw await uploadError(response, "Failed to upload newsletter photo");
  const result: HomepageResponse = await response.json();
  if (!result.newsletterImageUrl)
    throw new Error("No saved newsletter photo returned");
  return result;
}

export async function uploadGalleryImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", await prepareImageUpload(file));
  const response = await fetch("/api/admin/homepage/image/gallery", {
    method: "POST",
    body: formData,
  });
  if (!response.ok)
    throw await uploadError(response, "Failed to upload gallery photo");
  const result = (await response.json()) as { url?: string };
  if (!result.url) throw new Error("No saved gallery photo returned");
  return result.url;
}
