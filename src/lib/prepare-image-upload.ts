const MAX_PROXY_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;

/**
 * Keeps multipart image uploads below Vercel's 4.5 MB function payload limit.
 * The 4 MB target leaves room for multipart headers and boundaries.
 */
export async function prepareImageUpload(file: File): Promise<File> {
  if (file.size <= MAX_PROXY_IMAGE_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This browser could not prepare the image. Choose a smaller image.");
  }

  try {
    let scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser could not prepare the image.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const quality = Math.max(0.58, 0.82 - attempt * 0.08);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality),
      );
      if (blob && blob.size <= MAX_PROXY_IMAGE_BYTES) {
        const name = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([blob], `${name}.webp`, { type: "image/webp" });
      }

      scale *= 0.75;
    }
  } finally {
    bitmap.close();
  }

  throw new Error("Choose a smaller image (maximum upload size is 4 MB).");
}
