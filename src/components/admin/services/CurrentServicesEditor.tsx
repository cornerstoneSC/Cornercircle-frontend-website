"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import CombinedServicesPage from "@/components/public/services/CombinedServicesPage";
import CompanionshipDetailsPage from "@/components/public/services/CompanionshipDetailsPage";
import EventPlanningDetailsPage from "@/components/public/services/EventPlanningDetailsPage";
import { defaultCurrentServicesContent, type CurrentServicesContent } from "@/lib/services-content";
import { getCurrentServicesContent, saveCurrentServicesContent } from "@/services/services-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

type PageKey = "main" | "companionship" | "eventPlanning";
const pages: { key: PageKey; label: string }[] = [{ key:"main",label:"Services" },{ key:"companionship",label:"Companionship" },{ key:"eventPlanning",label:"Event planning" }];

export default function CurrentServicesEditor(){
  const [content,setContent]=useState<CurrentServicesContent>(defaultCurrentServicesContent); const [saved,setSaved]=useState<CurrentServicesContent>(defaultCurrentServicesContent); const [active,setActive]=useState<PageKey>("main");
  const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  const dirty=JSON.stringify(content)!==JSON.stringify(saved); useUnsavedChanges(dirty);
  useEffect(()=>{getCurrentServicesContent().then(value=>{setContent(value);setSaved(value)}).catch(err=>setError(err instanceof Error?err.message:"Unable to load Services content.")).finally(()=>setLoading(false))},[]);
  function edit(section:PageKey,field:string,value:string){setMessage("");setContent(current=>({...current,[section]:{...current[section],[field]:value}}))}
  function editAudience(index:number,value:string){setMessage("");setContent(current=>({...current,companionship:{...current.companionship,audience:current.companionship.audience.map((item,i)=>i===index?value:item)}}))}
  async function publish(){setBusy(true);setError("");setMessage("");try{const result=await saveCurrentServicesContent(content);setContent(result);setSaved(result);setMessage("Services pages published successfully.")}catch(err){setError(err instanceof Error?err.message:"Unable to publish Services pages.")}finally{setBusy(false)}}
  const preview=active==="main"
    ? <CombinedServicesPage content={content} onEdit={(field,value)=>edit("main",field,value)}/>
    : active==="companionship"
      ? <CompanionshipDetailsPage content={content} onEdit={(field,value)=>edit("companionship",field,value)} onEditAudience={editAudience}/>
      : <EventPlanningDetailsPage content={content} onEdit={(field,value)=>edit("eventPlanning",field,value)}/>;
  return <section className="border-b border-stone-200 bg-[#ebe8df]">
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fbfaf7]/95 px-5 py-4 shadow-sm backdrop-blur md:px-8"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4"><div className="mr-auto"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#9c7127]">Page editor</p><h1 className="font-serif text-3xl text-[#173b2c]">Services</h1></div><nav className="flex rounded-lg border border-stone-300 bg-white p-1" aria-label="Services page previews">{pages.map(page=><button key={page.key} type="button" onClick={()=>setActive(page.key)} className={`rounded-md px-4 py-2 text-sm font-semibold ${active===page.key?"bg-[#52704d] text-white":"text-stone-600 hover:bg-stone-100"}`}>{page.label}</button>)}</nav><button type="button" disabled={!dirty||busy} onClick={()=>{setContent(saved);setMessage("")}} className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm disabled:opacity-40">Discard</button><button type="button" disabled={!dirty||busy||loading} onClick={()=>void publish()} className="rounded-md bg-[#9d7a3c] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{busy?"Publishing…":"Publish changes"}</button></div></header>
    <div className="mx-auto max-w-[1700px] p-5 xl:p-8">
      {loading&&<p className="mb-4 rounded-md bg-white p-3 text-sm text-stone-600">Loading Services content…</p>}
      {error&&<p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message&&<p role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      <div className="min-w-0 overflow-hidden rounded-xl border border-stone-300 bg-white shadow-xl"><div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[.15em] text-stone-500"><Eye size={16}/>Live inline editor · click text to edit</div><div aria-label={`Editable preview of ${active} page`} className="max-h-[1100px] overflow-y-auto" onClickCapture={(event)=>{if((event.target as HTMLElement).closest("a"))event.preventDefault()}}>{preview}</div></div>
    </div>
  </section>;
}
