"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { uploadAboutImage } from "@/services/homepage.service";

type AboutEditorProps = {
  onUploaded: (imageUrl: string) => void;
};

export default function AboutEditor({ onUploaded }: AboutEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onUploaded(previewUrl);

    try {
      setError(null);
      setIsUploading(true);
      const result = await uploadAboutImage(file);

      onUploaded(result.aboutImageUrl);
    } catch (err) {
      console.error(err);
      setError("Unable to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
      URL.revokeObjectURL(previewUrl);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openFilePicker}
        disabled={isUploading}
        className="absolute left-1/2 top-4 z-20 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-plum shadow-lg transition hover:bg-stone-100 disabled:opacity-50"
      >
        <ImagePlus size={17} />
        {isUploading ? "Uploading..." : "Edit about photo"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageChange}
        className="hidden"
      />

      {error && (
        <p className="absolute left-1/2 top-16 z-20 -translate-x-1/2 rounded-md bg-white px-3 py-2 text-sm text-red-600 shadow-lg">
          {error}
        </p>
      )}
    </>
  );
}
