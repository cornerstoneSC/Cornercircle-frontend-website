import styles from "./EventPlanningHero.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";

export default function EventPlanningHero({ content }: { content: CurrentServicesContent["eventPlanning"] }) {
  return <section className={styles.hero} aria-labelledby="event-planning-title">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h1 id="event-planning-title">{content.title.split("\n").map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</h1>
      <p className={styles.intro}>{content.description}</p>
      <div className={styles.actions}><a className={styles.primary} href="#event-consultation">{content.primaryCta}</a><a className={styles.secondary} href="#experiences-heading">{content.secondaryCta} <span aria-hidden="true">→</span></a></div>
    </div>
    <div className={styles.art} aria-hidden="true">
      <div className={styles.values}><span>Thoughtful</span><i/><span>Personal</span><i/><span>Joyfully<br/>planned</span></div>
    </div>
  </section>;
}
