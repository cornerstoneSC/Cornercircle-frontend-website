"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useState } from "react";
import styles from "./NewsletterSection.module.css";
import { subscribeNewsletter } from "@/services/newsletter.service";

type Props = { imageUrl?: string; photoControls?: ReactNode; previewOnly?: boolean };

export default function NewsletterSection({ imageUrl, photoControls, previewOnly = false }: Props) {
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setError("");
    try {
      const status = await subscribeNewsletter(
        String(fields.get("email") || ""),
        String(fields.get("website") || ""),
        window.location.pathname,
      );
      form.reset();
      setSuccess(
        status === "ALREADY_SUBSCRIBED"
          ? "You’re already part of the Circle. We’re glad you’re here."
          : status === "REACTIVATED"
            ? "Welcome back! Your subscription is active again."
            : "Welcome to the Circle! Please check your inbox.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to subscribe right now.");
    } finally { setBusy(false); }
  }

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.panel}>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.photo}>
            <Image
              src={imageUrl || "/images/home/companionship-story.jpg"}
              alt=""
              fill
              unoptimized={imageUrl?.startsWith("blob:")}
              sizes="(max-width: 760px) 82vw, 44vw"
              className={styles.image}
            />
            {photoControls}
          </div>
        </div>

        <div className={styles.content}>
          <h2 id="newsletter-heading">Subscribe to stay connected.</h2>
          {success ? (
            <p className={styles.success} role="status">
              {success}
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
                  disabled={previewOnly}
                  required
                />
              </div>
              <label className={styles.srOnly} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

              <button className={styles.submitButton} type="submit" disabled={busy || previewOnly}>{busy ? "Joining…" : "Join the Circle"}</button>
              {error && <p className={styles.success} role="alert">{error}</p>}
              <p className={styles.privacy}>Thoughtful updates only. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
