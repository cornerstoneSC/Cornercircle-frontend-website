"use client";
import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import ContactPage from "@/components/public/contact/ContactPage";
import { defaultContactContent, type ContactContent } from "@/lib/contact-content";
import { getContactContent, saveContactContent, uploadContactPhoto } from "@/services/contact-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

export default function ContactEditor({ enquiryEmail }: { enquiryEmail: string }) {
  const [content, setContent] = useState(defaultContactContent); const [saved, setSaved] = useState(defaultContactContent);
  const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const input = useRef<HTMLInputElement>(null);
  const pending = useRef<{ file: File; preview: string } | null>(null); const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  useUnsavedChanges(dirty);
  useEffect(() => { getContactContent().then(v => { setContent(v); setSaved(v); setReady(true); }).catch(e => setError(e instanceof Error ? e.message : "Unable to load the Contact page.")); return () => { if (pending.current) URL.revokeObjectURL(pending.current.preview); }; }, []);
  const edit = (key: string, value: string) => setContent(current => ({ ...current, [key]: value } as ContactContent));
  async function choose(file?: File) { if (!file) return; if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { setError("Choose a JPEG, PNG or WebP image under 10 MB."); return; } if (pending.current) URL.revokeObjectURL(pending.current.preview); const preview = URL.createObjectURL(file); pending.current = { file, preview }; edit("imageUrl", preview); }
  function discard() { if (pending.current) URL.revokeObjectURL(pending.current.preview); pending.current = null; if (input.current) input.current.value = ""; setContent(saved); setError(""); }
  async function save() { setBusy(true); setError(""); try { const draft = { ...content }; if (pending.current) draft.imageUrl = await uploadContactPhoto(pending.current.file); const result = await saveContactContent(draft); setContent(result); setSaved(result); if (pending.current) URL.revokeObjectURL(pending.current.preview); pending.current = null; } catch (e) { setError(e instanceof Error ? e.message : "Unable to save."); } finally { setBusy(false); } }
  return <div className="min-h-full bg-[#f7f3ec] [&_[contenteditable=true]]:outline [&_[contenteditable=true]]:outline-1 [&_[contenteditable=true]]:outline-dashed [&_[contenteditable=true]]:outline-[#b69a64]/45 [&_[contenteditable=true]]:outline-offset-4">
    <div className="sticky top-0 z-40 flex flex-wrap items-end gap-3 border-b bg-white/95 px-4 py-3 shadow-sm">
      <label className="flex min-h-10 items-center gap-2 rounded border px-3 text-sm font-medium text-stone-700">
        <input type="checkbox" checked={content.enquiriesEnabled} onChange={event => setContent(current => ({ ...current, enquiriesEnabled: event.target.checked }))}/>
        Enquiry form enabled (opens the visitor&apos;s email app)
      </label>
      <label className="min-w-60 flex-1 text-xs font-medium text-stone-600">
        Contact photo description
        <input className="mt-1 block min-h-10 w-full rounded border px-3 text-sm text-stone-900" value={content.imageAlt} maxLength={3000} onChange={event => edit("imageAlt", event.target.value)}/>
      </label>
      <span className="text-xs text-stone-500">{dirty ? "Unsaved changes" : "All changes saved"}</span>
      <button disabled={!dirty || busy} onClick={discard} className="min-h-10 border px-4 py-2 text-sm disabled:opacity-40">Discard</button>
      <button disabled={!ready || !dirty || busy} onClick={() => void save()} className="min-h-10 bg-[#a18452] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy ? "Saving…" : "Save changes"}</button>
    </div>
    {error && <p role="alert" className="m-4 rounded bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    <ContactPage enquiryEmail={enquiryEmail} content={content} onEdit={edit} photoControl={<div className="absolute right-5 top-5 z-20"><button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow"><ImagePlus size={17}/>Edit photo</button><input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { void choose(e.target.files?.[0]); e.target.value = ""; }}/></div>} />
  </div>;
}
