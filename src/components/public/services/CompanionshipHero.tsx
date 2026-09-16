import styles from "./CompanionshipHero.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";

export default function CompanionshipHero({ content }: { content: CurrentServicesContent["companionship"] }) {
  return <section className={styles.hero} aria-labelledby="companionship-heading">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h1 id="companionship-heading">{content.title.split("\n").map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</h1>
      <p className={styles.intro}>{content.description}</p>
      <div className={styles.actions}><a className={styles.primary} href="#consultation">{content.primaryCta}</a><a className={styles.secondary} href="#options">{content.secondaryCta} <span aria-hidden="true">→</span></a></div>
    </div>
    <div className={styles.art} aria-hidden="true">
      <span className={styles.goldArc}/><span className={styles.sun}/><span className={styles.darkShape}/><span className={styles.lightShape}/><span className={styles.foreground}/>
      <div className={styles.values}><span>Kindness</span><i/><span>Presence</span><i/><span>Brighter<br/>days</span></div>
    </div>
  </section>;
}
