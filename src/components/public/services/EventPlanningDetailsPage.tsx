"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import ConsultationSection from "./ConsultationSection";
import EventPlanningHero from "./EventPlanningHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import styles from "./CombinedServicesPage.module.css";
import optionStyles from "./CompanionshipDetailsPage.module.css";
import EditableText from "./EditableText";

export default function EventPlanningDetailsPage({ googleBookingUrl, content, onEditCopy, heroPhotoControl }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditCopy?: (field: string, value: string) => void; heroPhotoControl?: ReactNode }) {
  const [selectedOption, setSelectedOption] = useState(1);
  function selectOptionFromKeyboard(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? current % 4 + 1
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (current + 2) % 4 + 1
      : event.key === "Home" ? 1
      : event.key === "End" ? 4
      : null;
    if (!next) return;
    event.preventDefault();
    setSelectedOption(next);
    document.getElementById(`event-planning-tab-${next}`)?.focus();
  }
  const copy = (field: string, options?: { multiline?: boolean; maxLength?: number }) => onEditCopy
    ? <EditableText value={content.copy[field]} label={field} onChange={(next) => onEditCopy(field, next)} {...options}/>
    : content.copy[field];
  return <div className={styles.page}>
    <EventPlanningHero imageSrc={content.images.eventPlanningHero} photoControl={heroPhotoControl}/>

    <section id="experiences-heading" className={optionStyles.options} aria-label="Event planning options">
      <nav className={optionStyles.servicesMenu} aria-label="Event planning options">
        <h2>Event planning options</h2>
        <ul role="tablist" aria-orientation="vertical">{[1, 2, 3, 4].map((number) => <li key={number} role="presentation">
          <button type="button" role="tab" id={`event-planning-tab-${number}`} aria-controls={`event-planning-option-${number}`} aria-selected={selectedOption === number} tabIndex={selectedOption === number ? 0 : -1} className={selectedOption === number ? optionStyles.activeService : undefined} onClick={() => setSelectedOption(number)} onKeyDown={(event) => selectOptionFromKeyboard(event, number)}>
            <span>{content.copy[`experience${number}Title`]}</span><span aria-hidden="true">›</span>
          </button>
        </li>)}</ul>
      </nav>
      <div className={optionStyles.optionsContent}>
        <div className={optionStyles.optionList}>
          <article id={`event-planning-option-${selectedOption}`} role="tabpanel" aria-labelledby={`event-planning-tab-${selectedOption}`}>
            <p className={optionStyles.optionEyebrow}>{content.copy[`experience${selectedOption}Title`]}</p>
            <p className={optionStyles.optionIntro}>{copy(`experience${selectedOption}Text`, { multiline: true })}</p>
            <p className={optionStyles.optionDescription}>{copy(`experience${selectedOption}Description`, { multiline: true })}</p>
            <div className={optionStyles.reasons}>
              <h3>Why choose us</h3>
              <ul>{[1,2,3,4].map((number) => <li key={number}><span aria-hidden="true" />{copy(`experience${selectedOption}Reason${number}`)}</li>)}</ul>
            </div>
            <div className={optionStyles.optionActions}>
              <a className={optionStyles.optionPrimary} href="#event-consultation">Book a Free Consultation</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="process" className={styles.process} aria-labelledby="event-process-heading">
      <p className={styles.eyebrow}>{copy("eventProcessEyebrow")}</p><h2 id="event-process-heading">{copy("eventProcessTitle")}</h2>
      <div className={styles.eventFlow}>
        {[1,2,3,4].map(number=><article key={number}><b>{number}</b><h3>{copy(`eventProcess${number}Title`)}</h3><p>{copy(`eventProcess${number}Text`, { multiline: true })}</p></article>)}
      </div>
    </section>

    <ConsultationSection googleBookingUrl={googleBookingUrl} variant="event" id="event-consultation" editableCopy={content.copy} onEditCopy={onEditCopy}/>
  </div>;
}
