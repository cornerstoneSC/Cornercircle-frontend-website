"use client";

import { useState, type KeyboardEvent } from "react";
import ConsultationSection from "./ConsultationSection";
import EventPlanningHero from "./EventPlanningHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import styles from "./CombinedServicesPage.module.css";
import optionStyles from "./CompanionshipDetailsPage.module.css";
import EditableText from "./EditableText";

const eventDetails = [
  {
    description: "We plan warm, well-organized celebrations that honor the people and moments that matter. From birthdays and holidays to appreciation events and milestones, every detail is shaped around your guests, setting, and vision.",
    reasons: ["A celebration tailored to your occasion", "Thoughtful planning from start to finish", "Clear coordination with your team or family", "Welcoming details for every guest"],
  },
  {
    description: "Creative programs bring people together through accessible, hands-on experiences. We coordinate the concept, materials, timing, and flow so participants can relax, create, and enjoy meaningful time together.",
    reasons: ["Programs adapted to the group", "Engaging and accessible activities", "Materials and logistics thoughtfully arranged", "A relaxed, encouraging atmosphere"],
  },
  {
    description: "Social experiences are designed to make connection feel natural and enjoyable. Whether it is music, a tea party, games, or a themed gathering, we create an inviting environment where guests feel comfortable participating.",
    reasons: ["Experiences built around genuine connection", "Flexible themes and formats", "A welcoming pace for the group", "Attentive on-site coordination"],
  },
  {
    description: "Community outings combine enjoyable local experiences with clear, dependable planning. We help coordinate the destination, schedule, accessibility considerations, and group details for a smoother day out.",
    reasons: ["Clear plans and communication", "Accessibility considered from the start", "Schedules shaped around the group", "Personal attention throughout the experience"],
  },
] as const;

export default function EventPlanningDetailsPage({ googleBookingUrl, content, onEditCopy }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditCopy?: (field: string, value: string) => void }) {
  const [selectedOption, setSelectedOption] = useState(1);
  const selectedDetails = eventDetails[selectedOption - 1];
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
    <EventPlanningHero/>

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
            <p className={optionStyles.optionDescription}>{selectedDetails.description}</p>
            <div className={optionStyles.reasons}>
              <h3>Why choose us</h3>
              <ul>{selectedDetails.reasons.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul>
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
