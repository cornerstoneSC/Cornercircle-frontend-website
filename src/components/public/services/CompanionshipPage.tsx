import Image from "next/image";
import { HouseHeart, Coffee, HeartHandshake, Palette, Plus, Sprout } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import styles from "./CompanionshipPage.module.css";
import { defaultServicesContent, type ServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";
import type { ReactNode } from "react";

const offeringIcons = [HouseHeart, Coffee, HeartHandshake, Palette];

export default function CompanionshipPage({ enquiryEmail, content = defaultServicesContent, onEdit, photoControls }: {
  enquiryEmail?: string; content?: ServicesContent;
  onEdit?: (path: string, value: string) => void;
  photoControls?: (key: "heroImage" | "gardenImage") => ReactNode;
}) {
  const text = (path: string, value: string) => onEdit ? <EditableText label={path} value={value} onChange={(next) => onEdit(path, next)} /> : value;
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="services-heading">
        <Image src={content.heroImage} alt={content.heroAlt} unoptimized={content.heroImage.startsWith("https://") || content.heroImage.startsWith("blob:")} fill priority sizes="100vw" className={styles.heroImage} />
        {photoControls?.("heroImage")}
        <div className={styles.heroInner}>
          <div className={styles.heroPanel}>
            <p className={styles.eyebrow}>{text("heroLabel", content.heroLabel)}</p>
            <h1 id="services-heading" className={styles.multiline}>{text("heroTitle", content.heroTitle)}</h1>
            <p className={styles.heroCopy}>{text("heroDescription", content.heroDescription)}</p>
            {onEdit ? <>
              <span className={styles.button}>{text("heroCta",content.heroCta)}</span>
              <span className={styles.textLink}>{text("howLabel",content.howLabel)}</span>
            </> : <>
              <a href="#companionship-enquiry" className={styles.button}>{content.heroCta}</a>
              <a href="#how-it-works" className={styles.textLink}>{content.howLabel}</a>
            </>}
          </div>
        </div>
      </section>

      <section className={styles.offerings} aria-label="Our companionship services">
        {content.offerings.map(({ title, description }, index) => {
          const Icon = offeringIcons[index] || HouseHeart;
          return <article className={styles.offering} key={index}>
            <Icon size={54} strokeWidth={1} aria-hidden="true" />
            <h2>{text(`offerings.${index}.title`,title)}</h2><p>{text(`offerings.${index}.description`,description)}</p>
          </article>;
        })}
      </section>

      <section className={styles.approach} aria-labelledby="approach-heading">
        <figure className={styles.garden}>
          {photoControls?.("gardenImage")}
          <Image src={content.gardenImage} alt={content.gardenAlt} unoptimized={content.gardenImage.startsWith("https://") || content.gardenImage.startsWith("blob:")} width={1448} height={1086} sizes="(max-width: 700px) 90vw, 48vw" />
          <figcaption className={styles.multiline}>{text("note",content.note)}<span aria-hidden="true" /></figcaption>
        </figure>
        <div className={styles.approachCopy}>
          <h2 id="approach-heading" className={styles.multiline}>{text("approachTitle",content.approachTitle)}</h2>
          <p className={styles.multiline}>{text("approachDescription",content.approachDescription)}</p>
        </div>
      </section>

      <section id="how-it-works" className={styles.steps} aria-labelledby="steps-heading">
        <div className={styles.stepsInner}>
          <h2 id="steps-heading" className={styles.multiline}>{text("stepsTitle",content.stepsTitle)}</h2>
          {content.steps.map((step, index) => <article className={styles.step} key={index}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span>
            <h3>{text(`steps.${index}.title`,step.title)}</h3><p>{text(`steps.${index}.text`,step.text)}</p>
          </article>)}
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-heading">
        <h2 id="faq-heading">{text("faqTitle",content.faqTitle)}</h2>
        {content.questions.map(({ question, answer, items }, index) => <details key={index} open={onEdit ? true : undefined}>
          <summary>{text(`questions.${index}.question`,question)}<Plus size={22} strokeWidth={1} aria-hidden="true" /></summary>
          <p>{text(`questions.${index}.answer`,answer)}</p>
          {items && <ul className={styles.faqList}>{items.map((item, itemIndex) => <li key={itemIndex}>{text(`questions.${index}.items.${itemIndex}`,item)}</li>)}</ul>}
        </details>)}
      </section>

      <section id="companionship-enquiry" className={styles.enquiry} aria-labelledby="enquiry-heading">
        <div className={styles.enquiryIntro}>
          <Sprout className={styles.sprout} strokeWidth={0.6} aria-hidden="true" />
          <div><h2 id="enquiry-heading" className={styles.multiline}>{text("enquiryTitle",content.enquiryTitle)}</h2>
            <span className={styles.rule} aria-hidden="true" />
            <p>{text("enquiryDescription",content.enquiryDescription)}</p>
          </div>
        </div>
        <EnquiryForm email={enquiryEmail} />
      </section>
    </div>
  );
}
