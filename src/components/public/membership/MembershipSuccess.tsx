"use client";

import Link from "next/link";
import { Check, Clock3, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { createMembershipBillingPortal, createMembershipRenewalCheckout, getMembershipStatus, type MembershipState } from "@/services/membership-application.service";
import styles from "./MembershipSuccess.module.css";

export default function MembershipSuccess({ applicationId }: { applicationId: string }) {
  const [membershipStatus, setMembershipStatus] = useState<MembershipState | "CHECKING">("CHECKING");
  const [message, setMessage] = useState("Confirming your secure payment with Stripe…");
  const [billing, setBilling] = useState({ recurring: false, cancelAtPeriodEnd: false, currentPeriodEnd: null as string | null });
  const [billingBusy, setBillingBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let attempts = 0;
    async function check() {
      try {
        const result = await getMembershipStatus(applicationId);
        if (!active) return;
        setMembershipStatus(result.status);
        setBilling({ recurring: result.recurring, cancelAtPeriodEnd: result.cancelAtPeriodEnd, currentPeriodEnd: result.currentPeriodEnd });
        if (result.paymentComplete) { setMessage("Your annual membership is active."); return; }
        attempts += 1;
        if (attempts < 12 && result.status === "PENDING_PAYMENT") window.setTimeout(check, 2000);
        else setMessage(result.status === "PENDING_PAYMENT" ? "Stripe is still confirming your payment. Please refresh this page shortly." : "Your payment requires attention. Please contact us if you need help.");
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "We couldn’t confirm your membership yet.");
      }
    }
    check();
    return () => { active = false; };
  }, [applicationId]);

  const active = membershipStatus === "ACTIVE";
  const renewalEligible = membershipStatus === "EXPIRED";
  async function renew() {
    setMessage("Preparing your secure renewal checkout…");
    try { const result = await createMembershipRenewalCheckout(applicationId); window.location.assign(result.checkoutUrl); }
    catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t start renewal checkout."); }
  }
  async function manageBilling() {
    setBillingBusy(true);
    setMessage("Opening secure billing management…");
    try { const result = await createMembershipBillingPortal(applicationId); window.location.assign(result.portalUrl); }
    catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t open billing management."); setBillingBusy(false); }
  }
  const renewalDate = billing.currentPeriodEnd ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${billing.currentPeriodEnd}T12:00:00`)) : null;
  return <main className={styles.page}>
    <section className={styles.card}>
      <div className={styles.monogram} aria-hidden="true">CSC</div>
      <div className={`${styles.icon} ${active ? styles.complete : ""}`}>{active ? <Check /> : <Clock3 />}</div>
      <p className={styles.eyebrow}>{active ? "Welcome to your circle" : "Payment confirmation"}</p>
      <h1>{active ? "Your membership begins here." : "We’re confirming everything."}</h1>
      <p className={styles.message}>{message}</p>
      <div className={styles.details}>
        <p><ShieldCheck /> Payment status is verified securely through Stripe.</p>
        <p><Mail /> A membership welcome email will follow once confirmation is complete.</p>
        {active && billing.recurring && <p><ShieldCheck /> {billing.cancelAtPeriodEnd ? `Automatic renewal is canceled. Access continues through ${renewalDate ?? "the end of your paid period"}.` : `Renews automatically each year${renewalDate ? ` on ${renewalDate}` : ""}.`}</p>}
      </div>
      <div className={styles.actions}>
        {renewalEligible && <button type="button" className={styles.primary} onClick={() => void renew()}>Renew membership</button>}
        {active && billing.recurring && <button type="button" className={styles.primary} disabled={billingBusy} onClick={() => void manageBilling()}>{billingBusy ? "Opening…" : "Manage billing"}</button>}
        <Link href="/events" className={styles.primary}>Browse events</Link>
        <Link href="/" className={styles.secondary}>Return home</Link>
      </div>
    </section>
  </main>;
}
