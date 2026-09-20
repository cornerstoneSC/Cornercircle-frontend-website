"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, ImagePlus } from "lucide-react";
import CombinedServicesPage from "@/components/public/services/CombinedServicesPage";
import CompanionshipDetailsPage from "@/components/public/services/CompanionshipDetailsPage";
import EventPlanningDetailsPage from "@/components/public/services/EventPlanningDetailsPage";
import { defaultCurrentServicesContent, type CurrentServicesContent } from "@/lib/services-content";
import { getCurrentServicesContent, saveCurrentServicesContent, uploadServicesPhoto } from "@/services/services-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

type PageKey = "main" | "companionship" | "eventPlanning";
const pages: { key: PageKey; label: string }[] = [{ key:"main",label:"Services" },{ key:"companionship",label:"Companionship" },{ key:"eventPlanning",label:"Event planning" }];
type ImageKey=keyof CurrentServicesContent["images"];

function PhotoPicker({label,onSelect}:{label:string;onSelect:(file:File)=>void}){
  const input=useRef<HTMLInputElement>(null);
  return <span className="absolute right-3 top-3 z-30"><button type="button" onClick={(event)=>{event.preventDefault();event.stopPropagation();input.current?.click()}} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-lg"><ImagePlus size={16}/>Edit photo</button><input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>{const file=event.target.files?.[0];if(file)onSelect(file);event.target.value=""}}/><span className="sr-only">Replace {label}</span></span>;
}

export default function CurrentServicesEditor(){
  const [content,setContent]=useState<CurrentServicesContent>(defaultCurrentServicesContent); const [saved,setSaved]=useState<CurrentServicesContent>(defaultCurrentServicesContent); const [active,setActive]=useState<PageKey>("main");
  const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  const pendingPhotos=useRef<Partial<Record<ImageKey,{file:File;preview:string;uploadedUrl?:string}>>>({});
  const dirty=JSON.stringify(content)!==JSON.stringify(saved); useUnsavedChanges(dirty);
  useEffect(()=>{getCurrentServicesContent().then(value=>{setContent(value);setSaved(value)}).catch(err=>setError(err instanceof Error?err.message:"Unable to load Services content.")).finally(()=>setLoading(false));return()=>{Object.values(pendingPhotos.current).forEach(photo=>URL.revokeObjectURL(photo.preview))}},[]);
  function edit(section:PageKey,field:string,value:string){setMessage("");setContent(current=>({...current,[section]:{...current[section],[field]:value}}))}
  function editAudience(index:number,value:string){setMessage("");setContent(current=>({...current,companionship:{...current.companionship,audience:current.companionship.audience.map((item,i)=>i===index?value:item)}}))}
  function editCopy(field:string,value:string){setMessage("");setContent(current=>({...current,copy:{...current.copy,[field]:value}}))}
  function selectPhoto(key:ImageKey,file:File){setError("");setMessage("");if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size===0||file.size>10*1024*1024){setError("Choose a JPEG, PNG or WebP image under 10 MB.");return}const previous=pendingPhotos.current[key];if(previous)URL.revokeObjectURL(previous.preview);const preview=URL.createObjectURL(file);pendingPhotos.current[key]={file,preview};setContent(current=>({...current,images:{...current.images,[key]:preview}}))}
  function clearPending(){Object.values(pendingPhotos.current).forEach(photo=>URL.revokeObjectURL(photo.preview));pendingPhotos.current={}}
  async function publish(){setBusy(true);setError("");setMessage("");try{const draft=structuredClone(content);for(const key of Object.keys(pendingPhotos.current) as ImageKey[]){const pending=pendingPhotos.current[key];if(!pending)continue;pending.uploadedUrl||=await uploadServicesPhoto(pending.file);draft.images[key]=pending.uploadedUrl}const result=await saveCurrentServicesContent(draft);clearPending();setContent(result);setSaved(result);setMessage("Services pages published successfully.")}catch(err){setError(err instanceof Error?err.message:"Unable to publish Services pages.")}finally{setBusy(false)}}
  const preview=active==="main"
    ? <CombinedServicesPage content={content} onEdit={(field,value)=>edit("main",field,value)} onEditCopy={editCopy} photoControls={{mainHero:<PhotoPicker label="main Services hero photo" onSelect={file=>selectPhoto("mainHero",file)}/>,companionshipCard:<PhotoPicker label="companionship service photo" onSelect={file=>selectPhoto("companionshipCard",file)}/>,eventCard:<PhotoPicker label="event-planning service photo" onSelect={file=>selectPhoto("eventCard",file)}/>}}/>
    : active==="companionship"
      ? <CompanionshipDetailsPage content={content} onEdit={(field,value)=>edit("companionship",field,value)} onEditAudience={editAudience} onEditCopy={editCopy}/>
      : <EventPlanningDetailsPage content={content} onEdit={(field,value)=>edit("eventPlanning",field,value)} onEditCopy={editCopy}/>;
  return <section className="border-b border-stone-200 bg-[#ebe8df]">
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fbfaf7]/95 px-5 py-4 shadow-sm backdrop-blur md:px-8"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4"><div className="mr-auto"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#9c7127]">Page editor</p><h1 className="font-serif text-3xl text-[#173b2c]">Services</h1></div><nav className="flex rounded-lg border border-stone-300 bg-white p-1" aria-label="Services page previews">{pages.map(page=><button key={page.key} type="button" onClick={()=>setActive(page.key)} className={`rounded-md px-4 py-2 text-sm font-semibold ${active===page.key?"bg-[#52704d] text-white":"text-stone-600 hover:bg-stone-100"}`}>{page.label}</button>)}</nav><button type="button" disabled={!dirty||busy} onClick={()=>{clearPending();setContent(saved);setMessage("")}} className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm disabled:opacity-40">Discard</button><button type="button" disabled={!dirty||busy||loading} onClick={()=>void publish()} className="rounded-md bg-[#9d7a3c] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{busy?"Publishing…":"Publish changes"}</button></div></header>
    <div className="mx-auto max-w-[1700px] p-5 xl:p-8">
      {loading&&<p className="mb-4 rounded-md bg-white p-3 text-sm text-stone-600">Loading Services content…</p>}
      {error&&<p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message&&<p role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      <div className="min-w-0 overflow-hidden rounded-xl border border-stone-300 bg-white shadow-xl"><div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[.15em] text-stone-500"><Eye size={16}/>Live inline editor · tap or click highlighted text to edit</div><div aria-label={`Editable preview of ${active} page`} className="admin-editor-preview [&_[contenteditable=true]]:outline [&_[contenteditable=true]]:outline-1 [&_[contenteditable=true]]:outline-dashed [&_[contenteditable=true]]:outline-[#b69a64]/45 [&_[contenteditable=true]]:outline-offset-4" onClickCapture={(event)=>{if((event.target as HTMLElement).closest("a"))event.preventDefault()}}>{preview}</div></div>
    </div>
  </section>;
}
