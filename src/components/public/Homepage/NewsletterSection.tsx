"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import styles from "./NewsletterSection.module.css";
import { subscribeNewsletter } from "@/services/newsletter.service";

export default function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setError("");
    try {
      await subscribeNewsletter(String(fields.get("email") || ""), String(fields.get("website") || ""));
      form.reset(); setSubmitted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to subscribe right now.");
    } finally { setBusy(false); }
  }

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.panel}>
        <div className={styles.visual} aria-hidden="true">
          <span className={styles.paperCircle} />
          <div className={styles.photo}>
            <Image
              src="/images/home/companionship-story.jpg"
              alt=""
              fill
              sizes="(max-width: 760px) 82vw, 44vw"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.content}>
          <h2 id="newsletter-heading">Subscribe to stay connected.</h2>
          {submitted ? (
            <p className={styles.success} role="status">
              You&apos;re on the list. We&apos;re glad you&apos;re here.
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.emailRow}>
                <label className={styles.srOnly} htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                />
              </div>
              <label className={styles.srOnly} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

              <button className={styles.submitButton} type="submit" disabled={busy}>{busy ? "Joining…" : "Join the Circle"}</button>
              {error && <p className={styles.success} role="alert">{error}</p>}
              <p className={styles.privacy}>Thoughtful updates only. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
