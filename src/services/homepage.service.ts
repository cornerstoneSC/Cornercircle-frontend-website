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
  contentJson?: string;
};

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
  formData.append("file", file);
  const response = await fetch("/api/admin/homepage/image/beliefs", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload beliefs photo");
  const result: HomepageResponse = await response.json();
  if (!result.beliefsImageUrl)
    throw new Error("No saved beliefs photo returned");
  return result;
}

export async function uploadHeroImage(file: File): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/homepage/image/hero", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload hero image");
  }
  return response.json();
}

export async function uploadAboutImage(file: File): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/homepage/image/about", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload about image");
  }
  return response.json();
}

export async function uploadFounderImage(
  file: File,
): Promise<HomepageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/homepage/founder-image", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload founder photo");
  return response.json();
}
