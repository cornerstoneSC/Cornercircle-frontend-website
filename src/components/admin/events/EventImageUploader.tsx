"use client";

import Image from "next/image";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";

import { ChangeEvent, useRef, useState } from "react";

import { uploadEventImage } from "@/lib/admin-events-api";

interface EventImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function EventImageUploader({
  value,
  onChange,
}: EventImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadEventImage(file);

      onChange(result.url);
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Unable to upload image.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  function handleBrowse() {
    inputRef.current?.click();
  }

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#E7DFD5] bg-[#FCFAF7]">
          <div className="aspect-[16/9] w-full">
            <Image
              src={value}
              alt="Event cover preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#5E5764] shadow-sm hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleBrowse}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D8CDBE] bg-white px-4 py-2.5 text-sm font-medium text-[#625A66] disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />

          {uploading ? "Uploading..." : "Replace Image"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleBrowse}
        disabled={uploading}
        className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#D8CDBE] bg-[#FCFAF7] px-6 py-10 text-center transition-colors hover:border-[var(--event-accent)] hover:bg-[#FAF6EF] disabled:opacity-50"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[var(--event-accent)]" />
          ) : (
            <ImageIcon className="h-6 w-6 text-[var(--event-accent)]" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#302B3A]">
            {uploading ? "Uploading..." : "Upload Event Image"}
          </p>

          <p className="mt-1 text-xs text-[#8A838C]">
            PNG, JPG or WEBP · max 10 MB
          </p>
        </div>

        <span className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#625A66] shadow-sm">
          Browse Files
        </span>
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
