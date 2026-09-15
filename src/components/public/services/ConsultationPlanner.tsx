"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, ExternalLink, UserRound, UsersRound } from "lucide-react";
import { createConsultation } from "@/services/service-consultations.service";
import styles from "./CombinedServicesPage.module.css";

export default function ConsultationPlanner({ googleBookingUrl, initialType = "companionship" }: { googleBookingUrl?: string; initialType?: "companionship" | "event" }) {
  const [type, setType] = useState<"companionship" | "event">(initialType);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const validGoogleUrl = googleBookingUrl?.startsWith("https://calendar.app.google/") || googleBookingUrl?.startsWith("https://calendar.google.com/");
  const today = (()=>{const date=new Date();const offset=date.getTimezoneOffset()*60_000;return new Date(date.getTime()-offset).toISOString().slice(0,10)})();
  useEffect(()=>{if(submitted)successRef.current?.focus()},[submitted]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");const fields=new FormData(event.currentTarget);const preferredDate=String(fields.get("preferredDate")||"");try{await createConsultation({type:type==="event"?"EVENT_PLANNING":"COMPANIONSHIP",name:String(fields.get("name")||""),email:String(fields.get("email")||""),phone:String(fields.get("phone")||""),organization:String(fields.get("organization")||""),preferredDate:preferredDate||undefined,preferredTime:String(fields.get("preferredTime")||""),notes:String(fields.get("notes")||""),website:String(fields.get("website")||"")});setSubmitted(true)}catch(reason){setError(reason instanceof Error?reason.message:"Unable to submit your request.")}finally{setBusy(false)}}
  if(submitted)return <div ref={successRef} className={styles.consultationSuccess} role="status" aria-live="polite" tabIndex={-1}><CalendarCheck aria-hidden="true"/><h3>Consultation request received</h3><p>Your request is saved, but your appointment is not confirmed yet. Choose an available 30-minute time on the Cornerstone Social Circle calendar.</p>{validGoogleUrl?<a href={googleBookingUrl} target="_blank" rel="noreferrer">Choose an appointment time <ExternalLink size={16} aria-hidden="true"/></a>:<Link href="/contact">Contact us to confirm a time</Link>}<button type="button" className={styles.secondaryAction} onClick={()=>setSubmitted(false)}>Submit another request</button><small>No payment is required today.</small></div>;
  return <form className={styles.consultationForm} onSubmit={submit}>
    <fieldset><legend>1. How can we help?</legend><div className={styles.typeOptions}>
      <label className={type === "companionship" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "companionship"} onChange={() => setType("companionship")} /><UserRound />Personal companionship</label>
      <label className={type === "event" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "event"} onChange={() => setType("event")} /><UsersRound />Plan an event</label>
    </div></fieldset>
    <fieldset className={styles.intakeFields}><legend>2. Tell us about yourself</legend><label><span>Name</span><input name="name" autoComplete="name" required maxLength={120}/></label><label><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={180}/></label><label><span>Phone <small>(optional)</small></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40}/></label>{type==="event"&&<label><span>Retirement home or organization</span><input name="organization" required maxLength={180}/></label>}<label><span>Preferred date <small>(optional—not confirmed)</small></span><input name="preferredDate" type="date" min={today}/></label><label><span>Preferred time <small>(optional—not confirmed)</small></span><input name="preferredTime" placeholder="For example, 2:30 PM" maxLength={40}/></label><label className={styles.fullField}><span>How can we help? <small>(Please don’t include sensitive medical information.)</small></span><textarea name="notes" rows={3} maxLength={3000}/></label><label className={styles.honeypot} aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1}/></label></fieldset>
    <div className={styles.calendarConnect}><CalendarCheck aria-hidden="true" /><div><strong>3. Choose a live 30-minute appointment</strong><p>After saving your request, Google Calendar will show current availability. Your appointment is confirmed only after you finish scheduling there.</p></div></div>
    <div className={styles.submitRow}><button type="submit" disabled={busy}>{busy?"Saving request…":"Continue to calendar"}</button><p>No payment is required today.</p></div>{error&&<p className={styles.formError} role="alert">{error}</p>}
  </form>;
}
