"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { uploadBeliefsImage } from "@/services/homepage.service";

export default function BeliefsEditor({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busyRef.current) return;
    setMessage("");
    setError("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose an image smaller than 10 MB.");
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await uploadBeliefsImage(file);
      // Only replace the displayed photo after it has been saved successfully.
      onUploaded(result.beliefsImageUrl!);
      setMessage("Beliefs photo saved to the homepage.");
    } catch {
      setError("Unable to save the photo. Your previous photo is unchanged. Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="absolute right-4 top-4 z-40 max-w-[280px] text-right">
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-plum shadow-lg hover:bg-stone-100 disabled:opacity-50">
        <ImagePlus size={17} aria-hidden="true" />
        {busy ? "Saving photo…" : "Edit beliefs photo"}
      </button>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="hidden" aria-label="Upload beliefs section photo" />
      {error && <p role="alert" className="mt-2 rounded-md bg-white p-3 text-sm text-red-700 shadow-lg">{error}</p>}
      {message && <p role="status" className="mt-2 rounded-md bg-white p-3 text-sm text-green-800 shadow-lg">{message}</p>}
    </div>
  );
}
