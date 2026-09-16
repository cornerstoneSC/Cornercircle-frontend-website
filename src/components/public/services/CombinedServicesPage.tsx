import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2, Leaf } from "lucide-react";
import ConsultationSection from "./ConsultationSection";
import styles from "./CombinedServicesPage.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

export default function CombinedServicesPage({ googleBookingUrl, content, onEdit, onEditCopy }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditCopy?: (field: string, value: string) => void }) {
  const text = (field: keyof CurrentServicesContent["main"], value: string, options?: { multiline?: boolean; maxLength?: number }) => onEdit
    ? <EditableText value={value} label={`Services ${field}`} onChange={(next) => onEdit(field, next)} {...options}/>
    : value;
  const copy = (field: string, options?: { multiline?: boolean; maxLength?: number }) => onEditCopy
    ? <EditableText value={content.copy[field]} label={field} onChange={(next) => onEditCopy(field, next)} {...options}/>
    : content.copy[field];
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="services-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{text("eyebrow", content.main.eyebrow, { maxLength: 80 })}</p>
        <h1 id="services-title">{text("title", content.main.title, { multiline: true, maxLength: 180 })}</h1>
        <p className={styles.lead}>{text("description", content.main.description, { multiline: true, maxLength: 700 })}</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#consultation">{copy("mainPrimaryCta")}</a>
          <a className={styles.textLink} href="#process">{copy("mainSecondaryCta")} <ArrowRight size={17} /></a>
        </div>
      </div>
      <div className={styles.heroPhoto}><Image src="/images/home/hero.jpg" alt="Members of the Cornerstone Social Circle community enjoying time together" fill priority sizes="(max-width: 820px) 100vw, 58vw" /></div>
    </section>

    <section className={styles.services} aria-labelledby="help-heading">
      <p className={styles.eyebrow}>{copy("servicesEyebrow")}</p>
      <h2 id="help-heading">{copy("servicesTitle")}</h2>
      <p className={styles.sectionIntro}>{copy("servicesIntro", { multiline: true, maxLength: 500 })}</p>
      <div className={styles.editorialServiceGrid}>
        <Link className={styles.editorialServiceCard} href="/services/companionship" aria-label="Explore personal companionship">
          <span className={styles.editorialCardCopy}><Leaf aria-hidden="true"/><span><h3>{copy("companionshipCardTitle")}</h3><small>{copy("companionshipCardTagline")}</small><i aria-hidden="true"/><p>{copy("companionshipCardDescription", { multiline: true, maxLength: 500 })}</p><strong>{copy("companionshipCardLink")} <ArrowRight size={17} aria-hidden="true"/></strong></span></span>
          <span className={styles.editorialCardPhoto}><Image src="/images/home/companionship-story.jpg" alt="An older adult enjoying a friendly walk with her companion" fill sizes="(max-width: 700px) 100vw, 25vw"/></span>
        </Link>
        <Link className={`${styles.editorialServiceCard} ${styles.eventServiceCard}`} href="/services/event-planning" aria-label="Explore event planning">
          <span className={styles.editorialCardCopy}><Flower2 aria-hidden="true"/><span><h3>{copy("eventCardTitle")}</h3><small>{copy("eventCardTagline")}</small><i aria-hidden="true"/><p>{copy("eventCardDescription", { multiline: true, maxLength: 500 })}</p><strong>{copy("eventCardLink")} <ArrowRight size={17} aria-hidden="true"/></strong></span></span>
          <span className={styles.editorialCardPhoto}><Image src="/images/home/hero.jpg" alt="A thoughtfully arranged social gathering for older adults and their community" fill sizes="(max-width: 700px) 100vw, 25vw"/></span>
        </Link>
      </div>
    </section>

    <section id="process" className={styles.process} aria-labelledby="process-heading">
      <p className={styles.eyebrow}>{copy("processEyebrow")}</p>
      <h2 id="process-heading">{copy("processTitle")}</h2>
      <p className={styles.sectionIntro}>{copy("processIntro")}</p>
      <div className={styles.flow}>
        <article><b>1</b><h3>{copy("process1Title")}</h3><p className={styles.required}>{copy("process1Text")}</p></article>
        <ArrowRight className={styles.arrow} />
        <article><b>2</b><h3>{copy("process2Title")}</h3><p>{copy("process2Text", { multiline: true })}</p></article>
        <div className={styles.branches}>
          <div><span>{copy("companionshipBranch")}</span><article><b>3</b><h3>{copy("companionshipStep3Title")}</h3><p>{copy("companionshipStep3Text", { multiline: true })}</p></article><ArrowRight className={styles.arrow} /><article><b>4</b><h3>{copy("companionshipStep4Title")}</h3><p>{copy("companionshipStep4Text", { multiline: true })}</p></article></div>
          <div><span>{copy("eventBranch")}</span><article><b>3</b><h3>{copy("eventStep3Title")}</h3><p>{copy("eventStep3Text", { multiline: true })}</p></article><ArrowRight className={styles.arrow} /><article><b>4</b><h3>{copy("eventStep4Title")}</h3><p>{copy("eventStep4Text", { multiline: true })}</p></article></div>
        </div>
      </div>
    </section>

    <ConsultationSection googleBookingUrl={googleBookingUrl} editableCopy={content.copy} onEditCopy={onEditCopy}/>

    <section className={styles.bottomCta}><div><p className={styles.eyebrow}>{copy("bottomEyebrow")}</p><h2>{copy("bottomTitle", { multiline: true })}</h2></div><Link className={styles.primaryButton} href="#consultation">{copy("bottomCta")}</Link></section>
  </div>;
}
