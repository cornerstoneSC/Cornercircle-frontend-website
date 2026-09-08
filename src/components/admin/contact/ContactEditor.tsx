"use client";
import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import ContactPage from "@/components/public/contact/ContactPage";
import { defaultContactContent, type ContactContent } from "@/lib/contact-content";
import { getContactContent, saveContactContent, uploadContactPhoto } from "@/services/contact-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

export default function ContactEditor() {
  const [content, setContent] = useState(defaultContactContent); const [saved, setSaved] = useState(defaultContactContent);
  const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const input = useRef<HTMLInputElement>(null);
  const pending = useRef<{ file: File; preview: string } | null>(null); const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  useUnsavedChanges(dirty);
  useEffect(() => { getContactContent().then(v => { setContent(v); setSaved(v); setReady(true); }).catch(e => setError(e instanceof Error ? e.message : "Unable to load the Contact page.")); return () => { if (pending.current) URL.revokeObjectURL(pending.current.preview); }; }, []);
  const edit = (key: string, value: string) => setContent(current => ({ ...current, [key]: value } as ContactContent));
  async function choose(file?: File) { if (!file) return; if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { setError("Choose a JPEG, PNG or WebP image under 10 MB."); return; } if (pending.current) URL.revokeObjectURL(pending.current.preview); const preview = URL.createObjectURL(file); pending.current = { file, preview }; edit("imageUrl", preview); }
  async function save() { setBusy(true); setError(""); try { const draft = { ...content }; if (pending.current) draft.imageUrl = await uploadContactPhoto(pending.current.file); const result = await saveContactContent(draft); setContent(result); setSaved(result); if (pending.current) URL.revokeObjectURL(pending.current.preview); pending.current = null; } catch (e) { setError(e instanceof Error ? e.message : "Unable to save."); } finally { setBusy(false); } }
  return <div className="min-h-full bg-[#f7f3ec]">
    {dirty && <div className="sticky top-0 z-40 flex items-center justify-end gap-3 border-b bg-white/95 px-4 py-3 shadow-sm"><span className="mr-auto text-xs text-stone-500">Unsaved changes</span><button onClick={() => setContent(saved)} className="border px-4 py-2 text-sm">Discard</button><button disabled={!ready || busy} onClick={() => void save()} className="bg-[#a18452] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy ? "Saving…" : "Save changes"}</button></div>}
    {error && <p role="alert" className="m-4 rounded bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    <ContactPage content={content} onEdit={edit} photoControl={<div className="absolute right-5 top-5 z-20"><button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow"><ImagePlus size={17}/>Edit photo</button><input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { void choose(e.target.files?.[0]); e.target.value = ""; }}/></div>} />
  </div>;
}
