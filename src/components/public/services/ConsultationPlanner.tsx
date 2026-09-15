"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, UserRound, UsersRound } from "lucide-react";
import styles from "./CombinedServicesPage.module.css";

const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "1:00 PM", "1:30 PM"];

export default function ConsultationPlanner() {
  const [type, setType] = useState<"companionship" | "event">("companionship");
  const [time, setTime] = useState("9:00 AM");
  const minimumDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  return <div className={styles.consultationForm}>
    <fieldset><legend>1. How can we help?</legend><div className={styles.typeOptions}>
      <label className={type === "companionship" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "companionship"} onChange={() => setType("companionship")} /><UserRound />Personal companionship</label>
      <label className={type === "event" ? styles.selected : ""}><input type="radio" name="service-type" checked={type === "event"} onChange={() => setType("event")} /><UsersRound />Plan an event</label>
    </div></fieldset>
    <fieldset><legend>2. Choose a preferred time <small>(30 minutes)</small></legend><label className={styles.dateField}><CalendarDays size={18} /><span>Preferred date</span><input type="date" min={minimumDate} /></label><div className={styles.timeGrid}>{times.map(value => <button key={value} type="button" className={time === value ? styles.activeTime : ""} onClick={() => setTime(value)}>{value}</button>)}</div></fieldset>
    <div className={styles.submitRow}><Link href={`/contact?topic=${type === "event" ? "event-planning" : "companionship"}`}>Continue to consultation request</Link><p>No payment is required today.</p></div>
  </div>;
}
