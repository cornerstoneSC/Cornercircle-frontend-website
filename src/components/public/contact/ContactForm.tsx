"use client";

import { useState, type FormEvent } from "react";
import styles from "./ContactPage.module.css";

type ContactFormProps = {
  email?: string;
  enabled?: boolean;
};

export default function ContactForm({ email, enabled = false }: ContactFormProps) {
  const [notice, setNotice] = useState("");
  const available = enabled && Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || !email) return;

    const fields = new FormData(event.currentTarget);
    const body = [
      `Name: ${fields.get("name")}`,
      `Email: ${fields.get("email")}`,
      `Phone: ${fields.get("phone") || "Not provided"}`,
      `Topic: ${fields.get("topic")}`,
      "",
      String(fields.get("message")),
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      "Cornerstone Social Circle enquiry",
    )}&body=${encodeURIComponent(body)}`;
    setNotice(
      "Your email app will open with your enquiry. Send it there to complete your message.",
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} aria-label="Contact enquiry">
      <label>
        <span>Your name</span>
        <input name="name" autoComplete="name" required maxLength={120} disabled={!available} />
      </label>

      <label>
        <span>Email address</span>
        <input name="email" type="email" autoComplete="email" required maxLength={180} disabled={!available} />
      </label>

      <label>
        <span>Phone (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} disabled={!available} />
      </label>

      <label>
        <span>Subject of inquiry</span>
        <select name="topic" defaultValue="" required disabled={!available}>
          <option value="" disabled>Select a subject</option>
          <option>Events and membership</option>
          <option>Senior companionship</option>
          <option>Partnerships</option>
          <option>General question</option>
        </select>
      </label>

      <label>
        <span>How can we help?</span>
        <textarea name="message" rows={4} required maxLength={3000} disabled={!available} />
      </label>

      <button type="submit" disabled={!available}>
        {available ? "Send enquiry" : "Enquiries opening soon"}
      </button>

      <p className={styles.formNotice} role="status">
        {notice ||
          (!available
            ? "Online enquiries are not available yet. Please check back soon."
            : "")}
      </p>

      {available && (
        <p className={styles.directEmail}>
          Prefer to email us directly?{" "}
          <a href="mailto:cornerstonesocialcircle@gmail.com">
            cornerstonesocialcircle@gmail.com
          </a>
        </p>
      )}
    </form>
  );
}
