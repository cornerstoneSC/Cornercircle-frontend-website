"use client";

import { ChangeEvent, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle } from "lucide-react";
import { uploadHeroImage } from "@/services/homepage.service";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 800;

type HeroEditorProps = {
  imageUrl: string;
  onPreview: (imageUrl: string) => void;
  onUploaded: (imageUrl: string) => void;
};

function readImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      reject(new Error("The selected image could not be read."));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

export default function HeroEditor({ imageUrl, onPreview, onUploaded }: HeroEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function openFilePicker() {
    if (!isUploading) fileInputRef.current?.click();
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setSuccess(false);

    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Choose an image smaller than 8 MB.");
      return;
    }

    try {
      const size = await readImageSize(file);
      if (size.width < MIN_WIDTH || size.height < MIN_HEIGHT) {
        setError(`Choose an image at least ${MIN_WIDTH} × ${MIN_HEIGHT} pixels.`);
        return;
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The selected image could not be read.");
      return;
    }

    const savedImageUrl = imageUrl;
    const previewUrl = URL.createObjectURL(file);
    onPreview(previewUrl);

    try {
      setIsUploading(true);
      const result = await uploadHeroImage(file);
      onUploaded(result.heroImageUrl);
      setSuccess(true);
    } catch (reason) {
      console.error(reason);
      onPreview(savedImageUrl);
      setError(reason instanceof Error ? reason.message : "The upload failed. Your previous hero image has been restored.");
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  }

  return (
    <div className="absolute right-4 top-4 z-20 flex max-w-[290px] flex-col items-end gap-2">
      <button
        type="button"
        onClick={openFilePicker}
        disabled={isUploading}
        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-plum shadow-lg transition hover:bg-stone-100 disabled:cursor-wait disabled:opacity-75"
      >
        {isUploading ? <LoaderCircle className="animate-spin" size={17} /> : <ImagePlus size={17} />}
        {isUploading ? "Uploading…" : "Replace hero photo"}
      </button>

      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />

      {error && <p role="alert" className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm leading-5 text-red-700 shadow-lg">{error}</p>}
      {success && !isUploading && <p role="status" className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-700 shadow-lg"><CheckCircle2 size={16} /> Hero photo saved</p>}
    </div>
  );
}
