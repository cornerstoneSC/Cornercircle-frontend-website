"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, ExternalLink, UserRound, UsersRound } from "lucide-react";
import styles from "./CombinedServicesPage.module.css";

export default function ConsultationPlanner({ googleBookingUrl }: { googleBookingUrl?: string }) {
  const [type, setType] = useState<"companionship" | "event">("companionship");
  const validGoogleUrl = googleBookingUrl?.startsWith("https://calendar.app.google/") || googleBookingUrl?.startsWith("https://calendar.google.com/");
  return <div className={styles.consultationForm}>
    <fieldset><legend>1. How can we help?</legend><div className={styles.typeOptions}>
      <label className={type === "companionship" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "companionship"} onChange={() => setType("companionship")} /><UserRound />Personal companionship</label>
      <label className={type === "event" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "event"} onChange={() => setType("event")} /><UsersRound />Plan an event</label>
    </div></fieldset>
    <div className={styles.calendarConnect}><CalendarCheck aria-hidden="true" /><div><strong>2. Choose an available 30-minute appointment</strong><p>Google Calendar shows live availability and prevents double-booking. Confirmation, rescheduling, and cancellation are handled securely by Google.</p></div></div>
    <div className={styles.submitRow}>{validGoogleUrl ? <a href={googleBookingUrl} target="_blank" rel="noreferrer">View available times <ExternalLink size={16} /></a> : <Link href={`/contact?topic=${type === "event" ? "event-planning" : "companionship"}`}>Request a consultation</Link>}<p>{validGoogleUrl ? "Opens the Cornerstone Social Circle booking calendar." : "Online calendar connection is being completed. You can still send a request."}</p></div>
  </div>;
}
