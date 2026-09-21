"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, ShieldCheck } from "lucide-react";
import styles from "./CompanionshipDetailsPage.module.css";
import ConsultationSection from "./ConsultationSection";
import CompanionshipHero from "./CompanionshipHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

const optionDetails = [
  {
    description: "Friendly visits provide relaxed, one-to-one companionship for older adults who would enjoy more conversation and connection in their week. Each visit follows the person’s interests and preferred pace, whether that means talking over coffee, enjoying music, playing a game, or simply spending comfortable time together.",
    reasons: ["Thoughtfully matched companionship", "Visits shaped around personal interests", "Dependable social connection", "A warm and unhurried approach"],
  },
  {
    description: "Errands and shopping support offers friendly accompaniment for everyday tasks outside the home. We can help make grocery trips, picking up essentials, and other planned errands feel easier, more organized, and more enjoyable without taking away the person’s independence.",
    reasons: ["Support that respects independence", "Patient, unhurried accompaniment", "Plans tailored to the individual", "Friendly company along the way"],
  },
  {
    description: "Outings and activities help older adults stay engaged with the places and experiences they enjoy. Visits can be planned around a familiar walk, a favourite café, a community activity, or another comfortable local destination.",
    reasons: ["Activities chosen around personal interests", "Encouragement to stay socially engaged", "Flexible local plans", "A familiar companion throughout the outing"],
  },
  {
    description: "Shared-meal visits bring company and conversation to a part of the day that can otherwise feel quiet. A companion can help plan or prepare a simple meal, sit down to eat together, and make the experience feel more social and enjoyable.",
    reasons: ["More enjoyable and social mealtimes", "Simple plans based on preferences", "Conversation without feeling rushed", "Respectful support in the home"],
  },
  {
    description: "Regular check-ins provide consistent companionship on a schedule that works for the individual. Seeing a familiar face each week can create a reassuring routine, strengthen trust, and offer something meaningful to look forward to.",
    reasons: ["A consistent and familiar companion", "Visits planned around existing routines", "Reliable connection throughout the week", "Clear communication with families"],
  },
  {
    description: "Family support provides dependable companionship for a loved one when relatives cannot be present. Visits focus on meaningful engagement, shared activities, and thoughtful communication so families can feel informed and reassured.",
    reasons: ["Dependable support from a trusted team", "Companionship tailored to your loved one", "Thoughtful updates and communication", "Greater reassurance for the whole family"],
  },
] as const;

export default function CompanionshipDetailsPage({ googleBookingUrl, content, onEdit, onEditAudience, onEditCopy }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditAudience?: (index: number, value: string) => void; onEditCopy?: (field: string, value: string) => void }) {
  const [selectedOption, setSelectedOption] = useState(1);
  const selectedDetails = optionDetails[selectedOption - 1];
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
    <CompanionshipHero/>

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
            <p className={styles.optionDescription}>{selectedDetails.description}</p>
            <div className={styles.reasons}>
              <h3>Why choose us</h3>
              <ul>{selectedDetails.reasons.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul>
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
