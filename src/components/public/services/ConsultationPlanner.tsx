"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, ExternalLink, UserRound, UsersRound } from "lucide-react";
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
  if(submitted)return <div ref={successRef} className={styles.consultationSuccess} role="status" aria-live="polite" tabIndex={-1}><span className={styles.successNumber}>03</span><CalendarCheck aria-hidden="true"/><p className={styles.successEyebrow}>Request received</p><h3>Choose your appointment</h3><p>Your information is saved, but your appointment is not confirmed yet. {validGoogleUrl?"Choose an available 30-minute time on the Cornerstone Social Circle calendar.":"Contact us and we’ll help you confirm a 30-minute time."}</p>{validGoogleUrl?<a href={googleBookingUrl} target="_blank" rel="noreferrer">Choose an appointment time <ExternalLink size={16} aria-hidden="true"/></a>:<Link href="/contact">Contact us to confirm a time</Link>}<button type="button" className={styles.secondaryAction} onClick={()=>setSubmitted(false)}>Submit another request</button><small>No payment is required today.</small></div>;
  return <form className={styles.consultationForm} onSubmit={submit}>
    <fieldset className={styles.formStep}>
      <legend className={styles.stepHeader}><span>01</span><span><strong>How can we help?</strong><small>Please select the option that best fits your needs.</small></span></legend>
      <div className={styles.typeOptions}>
        <label className={type === "companionship" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "companionship"} onChange={() => setType("companionship")} /><span className={styles.optionIcon}><UserRound aria-hidden="true" /></span><span><strong>Personal companionship</strong><small>A one-on-one conversation to learn more and explore options.</small></span></label>
        <label className={type === "event" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "event"} onChange={() => setType("event")} /><span className={styles.optionIcon}><UsersRound aria-hidden="true" /></span><span><strong>Plan an event</strong><small>Let’s discuss your event and how we can support you.</small></span></label>
      </div>
    </fieldset>
    <fieldset className={`${styles.formStep} ${styles.intakeFields}`}>
      <legend className={styles.stepHeader}><span>02</span><span><strong>Tell us about yourself</strong><small>This helps us prepare for our conversation.</small></span></legend>
      <label><span>Name <b aria-hidden="true">*</b></span><input name="name" autoComplete="name" placeholder="Your full name" required maxLength={120}/></label>
      <label><span>Email <b aria-hidden="true">*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={180}/></label>
      <label><span>Phone <small>(optional)</small></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(408) 123-4567" maxLength={40}/></label>
      {type==="event"&&<label><span>Retirement home or organization <b aria-hidden="true">*</b></span><input name="organization" placeholder="Organization name" required maxLength={180}/></label>}
      <label className={styles.fullField}><span>Preferred date <small>(optional—not confirmed)</small></span><input name="preferredDate" type="date" min={today}/></label>
      <label className={styles.fullField}><span>How can we help? <small>(Please don’t include sensitive medical information.)</small></span><textarea name="notes" rows={3} placeholder="Tell us a bit about what you’re looking for…" maxLength={3000}/></label>
      <label className={styles.honeypot} aria-hidden="true">Website<input name="website" autoComplete="off" tabIndex={-1}/></label>
    </fieldset>
    <section className={`${styles.formStep} ${styles.appointmentStep}`} aria-labelledby="appointment-step-title">
      <div className={styles.stepHeader}><span>03</span><span><strong id="appointment-step-title">Choose your appointment</strong><small>After submitting your information, you’ll see current availability and select a 30-minute time.</small></span></div>
      <div className={styles.submitRow}><button type="submit" disabled={busy}>{busy?"Saving request…":<>{validGoogleUrl?"Save & view available times":"Send my consultation request"} <ArrowRight aria-hidden="true" size={19}/></>}</button><p>No payment is required today.</p></div>
    </section>
    {error&&<p className={styles.formError} role="alert">{error}</p>}
  </form>;
}
