import styles from "./CompanionshipHero.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

export default function CompanionshipHero({ content, onEdit }: { content: CurrentServicesContent["companionship"]; onEdit?: (field: string, value: string) => void }) {
  const text = (field: keyof typeof content, value: string, options?: { multiline?: boolean; maxLength?: number }) => onEdit
    ? <EditableText value={value} label={`Companionship ${field}`} onChange={(next) => onEdit(field, next)} {...options}/>
    : value;
  return <section className={styles.hero} aria-labelledby="companionship-heading">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{text("eyebrow", content.eyebrow, { maxLength: 80 })}</p>
      <h1 id="companionship-heading">{text("title", content.title, { multiline: true, maxLength: 180 })}</h1>
      <p className={styles.intro}>{text("description", content.description, { multiline: true, maxLength: 700 })}</p>
      <div className={styles.actions}><a className={styles.primary} href="#consultation">{text("primaryCta", content.primaryCta, { maxLength: 80 })}</a><a className={styles.secondary} href="#options">{text("secondaryCta", content.secondaryCta, { maxLength: 80 })} <span aria-hidden="true">→</span></a></div>
    </div>
    <div className={styles.art} aria-hidden="true">
      <span className={styles.goldArc}/><span className={styles.sun}/><span className={styles.darkShape}/><span className={styles.lightShape}/><span className={styles.foreground}/>
      <div className={styles.values}><span>Kindness</span><i/><span>Presence</span><i/><span>Brighter<br/>days</span></div>
    </div>
  </section>;
}
