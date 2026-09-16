import styles from "./EventPlanningHero.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

export default function EventPlanningHero({ content, onEdit }: { content: CurrentServicesContent["eventPlanning"]; onEdit?: (field: string, value: string) => void }) {
  const text = (field: keyof typeof content, value: string, options?: { multiline?: boolean; maxLength?: number }) => onEdit
    ? <EditableText value={value} label={`Event planning ${field}`} onChange={(next) => onEdit(field, next)} {...options}/>
    : value;
  return <section className={styles.hero} aria-labelledby="event-planning-title">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{text("eyebrow", content.eyebrow, { maxLength: 80 })}</p>
      <h1 id="event-planning-title">{text("title", content.title, { multiline: true, maxLength: 180 })}</h1>
      <p className={styles.intro}>{text("description", content.description, { multiline: true, maxLength: 700 })}</p>
      <div className={styles.actions}><a className={styles.primary} href="#event-consultation">{text("primaryCta", content.primaryCta, { maxLength: 80 })}</a><a className={styles.secondary} href="#experiences-heading">{text("secondaryCta", content.secondaryCta, { maxLength: 80 })} <span aria-hidden="true">→</span></a></div>
    </div>
    <div className={styles.art} aria-hidden="true">
      <div className={styles.values}><span>Thoughtful</span><i/><span>Personal</span><i/><span>Joyfully<br/>planned</span></div>
    </div>
  </section>;
}
