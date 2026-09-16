import { Music, Palette, PartyPopper, UsersRound } from "lucide-react";
import ConsultationSection from "./ConsultationSection";
import EventPlanningHero from "./EventPlanningHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import styles from "./CombinedServicesPage.module.css";
import EditableText from "./EditableText";

const experienceIcons = [PartyPopper, Palette, Music, UsersRound];

export default function EventPlanningDetailsPage({ googleBookingUrl, content, onEdit, onEditCopy }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditCopy?: (field: string, value: string) => void }) {
  const copy = (field: string, options?: { multiline?: boolean; maxLength?: number }) => onEditCopy
    ? <EditableText value={content.copy[field]} label={field} onChange={(next) => onEditCopy(field, next)} {...options}/>
    : content.copy[field];
  return <div className={styles.page}>
    <EventPlanningHero content={content.eventPlanning} onEdit={onEdit}/>

    <section className={styles.services} aria-labelledby="experiences-heading">
      <p className={styles.eyebrow}>{copy("eventExperiencesEyebrow")}</p>
      <h2 id="experiences-heading">{copy("eventExperiencesTitle")}</h2>
      <p className={styles.sectionIntro}>{copy("eventExperiencesIntro", { multiline: true })}</p>
      <div className={styles.eventExperiences}>{experienceIcons.map((Icon,index)=><article key={index}><span><Icon size={24}/></span><h3>{copy(`experience${index + 1}Title`)}</h3><p>{copy(`experience${index + 1}Text`, { multiline: true })}</p></article>)}</div>
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
