"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ShieldCheck } from "lucide-react";
import styles from "./CompanionshipDetailsPage.module.css";
import ConsultationSection from "./ConsultationSection";
import CompanionshipHero from "./CompanionshipHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

export default function CompanionshipDetailsPage({ googleBookingUrl, content, onEdit, onEditAudience, onEditCopy, heroPhotoControl }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditAudience?: (index: number, value: string) => void; onEditCopy?: (field: string, value: string) => void; heroPhotoControl?: ReactNode }) {
  const [selectedOption, setSelectedOption] = useState(1);
  function selectOptionFromKeyboard(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? current % 6 + 1
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (current + 4) % 6 + 1
      : event.key === "Home" ? 1
      : event.key === "End" ? 6
      : null;
    if (!next) return;
    event.preventDefault();
    setSelectedOption(next);
    document.getElementById(`companionship-tab-${next}`)?.focus();
  }
  const editable = (field: "hourlyRate" | "minimum" | "startingTotal" | "primaryCta", value: string) => onEdit
    ? <EditableText value={value} label={`Companionship ${field}`} onChange={(next) => onEdit(field, next)} maxLength={100}/>
    : value;
  const copy = (field: string, options?: { multiline?: boolean; maxLength?: number }) => onEditCopy
    ? <EditableText value={content.copy[field]} label={field} onChange={(next) => onEditCopy(field, next)} {...options}/>
    : content.copy[field];
  return <div className={styles.page}>
    <CompanionshipHero imageSrc={content.images.companionshipHero} photoControl={heroPhotoControl}/>

    <section id="options" className={styles.options} aria-label="Companionship options">
      <nav className={styles.servicesMenu} aria-label="Companionship options">
        <h2>Companionship options</h2>
        <ul role="tablist" aria-orientation="vertical">{[1, 2, 3, 4, 5, 6].map((number) => <li key={number} role="presentation">
          <button type="button" role="tab" id={`companionship-tab-${number}`} aria-controls={`companionship-option-${number}`} aria-selected={selectedOption === number} tabIndex={selectedOption === number ? 0 : -1} className={selectedOption === number ? styles.activeService : undefined} onClick={() => setSelectedOption(number)} onKeyDown={(event) => selectOptionFromKeyboard(event, number)}>
            <span>{content.copy[`option${number}Title`]}</span><span aria-hidden="true">›</span>
          </button>
        </li>)}</ul>
      </nav>
      <div className={styles.optionsContent}>
        <div className={styles.optionList}>
          <article id={`companionship-option-${selectedOption}`} role="tabpanel" aria-labelledby={`companionship-tab-${selectedOption}`}>
            <p className={styles.optionEyebrow}>{content.copy[`option${selectedOption}Title`]}</p>
            <p className={styles.optionIntro}>{copy(`option${selectedOption}Text`, { multiline: true })}</p>
            <p className={styles.optionDescription}>{copy(`option${selectedOption}Description`, { multiline: true })}</p>
            <div className={styles.reasons}>
              <h3>Why choose us</h3>
              <ul>{[1,2,3,4].map((number) => <li key={number}><span aria-hidden="true" />{copy(`option${selectedOption}Reason${number}`)}</li>)}</ul>
            </div>
            <div className={styles.optionActions}>
              <a className={styles.optionPrimary} href="#consultation">Book a Free Consultation</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className={styles.audiencePricing} aria-labelledby="audience-heading">
      <svg className={styles.audienceBotanical} viewBox="0 0 150 420" aria-hidden="true"><path d="M18 420C24 304 35 198 63 82M32 315C63 277 91 250 126 233M42 252C17 220 10 184 17 145M50 189C81 155 105 132 135 119M29 337C13 316 5 291 6 264"/><path d="M17 146C1 181 7 219 42 252C47 211 38 175 17 146ZM135 119C96 126 70 149 50 189C91 180 120 157 135 119ZM126 233C86 236 57 264 32 315C77 299 108 272 126 233ZM6 264C-1 293 7 318 29 337C34 307 25 282 6 264Z"/></svg>
      <div className={styles.audienceCopy}><p className={styles.eyebrow}>{copy("audienceEyebrow")}</p><h2 id="audience-heading">{copy("audienceTitle", { multiline: true })}</h2><p>{copy("audienceIntro")}</p><ul>{content.companionship.audience.map((item, index) => <li key={index}><Check aria-hidden="true" />{onEditAudience ? <EditableText value={item} label={`Audience item ${index + 1}`} onChange={(next) => onEditAudience(index, next)} multiline maxLength={240}/> : item}</li>)}</ul><blockquote>{copy("audienceQuote")}</blockquote></div>
      <article className={styles.premiumPricing}><p className={styles.eyebrow}>{copy("pricingEyebrow")}</p><h2>{editable("hourlyRate", content.companionship.hourlyRate)} <small>/ hour</small></h2><hr/><strong>{editable("minimum", content.companionship.minimum)}</strong><span>{editable("startingTotal", content.companionship.startingTotal)}</span><hr/><p>{copy("pricingNote", { multiline: true })}</p><a href="#consultation">{editable("primaryCta", content.companionship.primaryCta)} <span aria-hidden="true">→</span></a><small>{copy("pricingFootnote")}</small></article>
    </section>

    <section className={styles.boundary}><ShieldCheck aria-hidden="true" /><div><h2>{copy("boundaryTitle")}</h2><p>{copy("boundaryText", { multiline: true })}</p></div><p>{copy("boundaryFocus", { multiline: true })}</p></section>

    <section className={styles.processSection}>
      <div className={styles.process}><p className={styles.eyebrow}>{copy("companionshipProcessEyebrow")}</p><h2>{copy("companionshipProcessTitle")}</h2><div>{[1,2,3,4].map((number) => <article key={number}><b>{number}</b><h3>{copy(`companionshipProcess${number}Title`)}</h3><p>{copy(`companionshipProcess${number}Text`, { multiline: true })}</p></article>)}</div></div>
    </section>

    <ConsultationSection googleBookingUrl={googleBookingUrl} variant="companionship" editableCopy={content.copy} onEditCopy={onEditCopy}/>
  </div>;
}
