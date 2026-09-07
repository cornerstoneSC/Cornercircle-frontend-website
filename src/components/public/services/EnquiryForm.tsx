"use client";

import { useState, type FormEvent } from "react";
import styles from "./CompanionshipPage.module.css";

export default function EnquiryForm({ email }: { email?: string }) {
  const [notice, setNotice] = useState("");
  const available = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available) return;
    const fields = new FormData(event.currentTarget);
    const body = `Name: ${fields.get("name")}\nEmail or phone: ${fields.get("contact")}\nEnquiring for: ${fields.get("for")}\n\n${fields.get("message")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Senior companionship enquiry")}&body=${encodeURIComponent(body)}`;
    setNotice("Your email app will open with your enquiry. Please send it there to complete your enquiry.");
  }

  return <form className={styles.form} onSubmit={submit} aria-label="Companionship enquiry">
    <label><span>Your name</span><input name="name" autoComplete="name" placeholder="Your name" required maxLength={120} disabled={!available} /></label>
    <label><span>Email or phone</span><input name="contact" placeholder="Email or phone" required maxLength={180} disabled={!available} /></label>
    <label><span>Who are you enquiring for?</span><select name="for" defaultValue="" required disabled={!available}>
      <option value="" disabled>Who are you enquiring for?</option><option>Myself</option><option>A loved one</option><option>Someone I support</option>
    </select></label>
    <label><span>Your message</span><textarea name="message" placeholder="Your message" rows={4} required maxLength={3000} disabled={!available} /></label>
    <button className={styles.button} type="submit" disabled={!available}>{available ? "Send Enquiry" : "Enquiries opening soon"}</button>
    <p className={styles.formNotice} role="status">{notice || (available ? "Opens your email app. Please don’t include sensitive medical information." : "Online enquiries are not available yet. Please check back soon.")}</p>
  </form>;
}
