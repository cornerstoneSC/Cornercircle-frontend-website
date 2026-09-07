"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import CompanionshipPage from "@/components/public/services/CompanionshipPage";
import { defaultServicesContent, type ServicesContent } from "@/lib/services-content";
import { getServicesContent, saveServicesContent, uploadServicesPhoto } from "@/services/services-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

type PhotoKey = "heroImage" | "gardenImage";

function PhotoPicker({ label, onSelect }: { label: string; onSelect: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <>
    <button type="button" aria-label={`Edit ${label} photo`} onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-lg"><ImagePlus size={17} aria-hidden="true" />Edit photo</button>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(file); event.target.value = ""; }} />
  </>;
}

export default function ServicesEditor() {
  const [content, setContent] = useState<ServicesContent>(defaultServicesContent);
  const [saved, setSaved] = useState<ServicesContent>(defaultServicesContent);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const pendingPhotos = useRef<Partial<Record<PhotoKey, { file: File; preview: string; uploadedUrl?: string }>>>({});
  const dirty = JSON.stringify(content) !== JSON.stringify(saved);

  function clearPendingPhotos() {
    Object.values(pendingPhotos.current).forEach((pending) => URL.revokeObjectURL(pending.preview));
    pendingPhotos.current = {};
  }
  useEffect(() => () => { Object.values(pendingPhotos.current).forEach((pending) => URL.revokeObjectURL(pending.preview)); }, []);

  useEffect(() => {
    let active = true;
    getServicesContent().then((value) => { if (active) { setContent(value); setSaved(value); setReady(true); } })
      .catch((err) => { if (active) setError((err instanceof Error ? err.message : "Unable to load content.") + " You can try editing the default preview, but publishing is disabled until saved content loads."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useUnsavedChanges(dirty);
  useEffect(() => {
    if (!notice || notice.startsWith("Photo replaced")) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function edit(path: string, value: string) {
    setNotice("");
    setContent((current) => {
      const next = structuredClone(current);
      const [group, index, field, item] = path.split(".");
      if (group === "offerings" && (field === "title" || field === "description")) next.offerings[Number(index)][field] = value;
      else if (group === "steps" && (field === "title" || field === "text")) next.steps[Number(index)][field] = value;
      else if (group === "questions") {
        const row = next.questions[Number(index)];
        if (field === "question" || field === "answer") row[field] = value;
        else if (field === "items") row.items[Number(item)] = value;
      } else if (group in next && typeof next[group as keyof ServicesContent] === "string") {
        Object.assign(next, { [group]: value });
      }
      return next;
    });
  }
  async function save() {
    setError(""); setNotice(""); setBusy(true);
    try {
      const draft = structuredClone(content);
      for (const key of ["heroImage", "gardenImage"] as const) {
        const pending = pendingPhotos.current[key];
        if (!pending) continue;
        setUploading(key);
        pending.uploadedUrl ||= await uploadServicesPhoto(pending.file);
        draft[key] = pending.uploadedUrl;
      }
      setUploading(null);
      const result = await saveServicesContent(draft);
      setContent(result); setSaved(result); setNotice("Saved. Your changes are now published on the Services page.");
      clearPendingPhotos();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save. Your changes are still here."); }
    finally { setBusy(false); setUploading(null); }
  }
  function selectPhoto(key: PhotoKey, file: File) {
    setError(""); setNotice("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > 10 * 1024 * 1024) { setError("Choose a JPEG, PNG or WebP image under 10 MB."); return; }
    const previous = pendingPhotos.current[key];
    if (previous) URL.revokeObjectURL(previous.preview);
    const preview = URL.createObjectURL(file);
    pendingPhotos.current[key] = { file, preview };
    edit(key, preview);
    setNotice("Photo replaced in your preview. Save changes to upload and publish it.");
  }
  const locked = loading || busy || !!uploading;

  return <div className="relative min-h-full bg-[#f7f3ec]">
    {dirty && <div className="sticky top-0 z-40 flex items-center justify-end gap-3 border-b border-stone-200 bg-[#fcfaf7]/95 px-4 py-3 shadow-sm backdrop-blur">
      <span role="status" className="mr-auto text-xs text-stone-500">{uploading ? "Uploading photo…" : busy ? "Saving…" : "Unsaved changes"}</span>
      <button disabled={locked} onClick={() => { setContent(saved); clearPendingPhotos(); setNotice(""); setError(""); }} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 disabled:opacity-40">Discard changes</button>
      <button onClick={() => void save()} disabled={!ready || locked} className="rounded-lg bg-[#a18452] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{busy ? "Saving…" : "Save changes"}</button>
    </div>}
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
    <section aria-label="Editable Services page preview" inert={locked} className="overflow-hidden">
      <CompanionshipPage content={content} onEdit={edit} photoControls={(key) => <div className="absolute right-4 top-4 z-20"><PhotoPicker label={key === "heroImage" ? "hero" : "garden"} onSelect={(file) => selectPhoto(key, file)} /></div>} />
    </section>
  </div>;
}
