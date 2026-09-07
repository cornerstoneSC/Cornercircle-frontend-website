import type { HomepageContent } from "@/types/homepage";

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

const MAX_PROXY_IMAGE_BYTES = 4 * 1024 * 1024;

async function prepareImageUpload(file: File): Promise<File> {
  if (file.size <= MAX_PROXY_IMAGE_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not prepare the image.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob || blob.size > MAX_PROXY_IMAGE_BYTES) {
    throw new Error("Choose a smaller image (maximum upload size is 4 MB).");
  }
  const name = file.name.replace(/\.[^.]+$/, "") || "homepage-image";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}

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
