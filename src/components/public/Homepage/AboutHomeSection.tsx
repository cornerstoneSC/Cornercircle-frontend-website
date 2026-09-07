import Image from "next/image";
import Link from "next/link";
import SectionIntroduction from "./SectionIntroduction";
import { ArrowRight } from "lucide-react";
import styles from "./AboutHomeSection.module.css";
import type { ReactNode } from "react";
import EditableText from "@/components/public/services/EditableText";
import { defaultHomepageContent } from "@/data/homepage";
import type { ServicesPreviewContent, StoryContent } from "@/types/homepage";

type AboutHomeSectionProps = { imageUrl?: string; photoControls?: ReactNode; story?: StoryContent; servicesPreview?: ServicesPreviewContent; onEdit?: (path: string, value: string) => void };

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.label}>{children}<span className={styles.labelLine} aria-hidden="true" /></div>;
}

export default function AboutHomeSection({ imageUrl, photoControls, story = defaultHomepageContent.story, servicesPreview = defaultHomepageContent.servicesPreview, onEdit }: AboutHomeSectionProps) {
  const photo = imageUrl || "/images/home/companionship-story.jpg";

  return (
    <section id="our-story" aria-labelledby="our-story-heading" className={styles.section}>
      <SectionIntroduction introduction={story.introduction} accent={story.accent}
        editableIntroduction={onEdit && <EditableText value={story.introduction} label="story introduction" onChange={(value) => onEdit("story.introduction", value)} />}
        editableAccent={onEdit && <EditableText value={story.accent} label="story accent" onChange={(value) => onEdit("story.accent", value)} />} />
      <div className={styles.composition}>
        <div className={styles.photo}>
          <Image
            src={photo}
            alt={story.imageAlt}
            fill
            unoptimized={photo.startsWith("blob:")}
            sizes="(min-width: 1600px) 1000px, (min-width: 1024px) 65vw, 100vw"
            className={styles.image}
          />
          {photoControls}
        </div>

        <article className={styles.story}>
          <PanelLabel>{onEdit ? <EditableText value={story.label} label="story label" onChange={(value) => onEdit("story.label", value)} /> : story.label}</PanelLabel>
          <h2 id="our-story-heading">{onEdit ? <EditableText value={story.heading} label="story heading" onChange={(value) => onEdit("story.heading", value)} /> : story.heading}</h2>
          <p className={styles.copy}>
            {onEdit ? <EditableText value={story.description} label="story description" onChange={(value) => onEdit("story.description", value)} /> : story.description}
          </p>
          <details className={styles.more}>
            <summary className={styles.button}>{onEdit ? <EditableText value={story.learnMoreLabel} label="learn more button" onChange={(value) => onEdit("story.learnMoreLabel", value)} /> : story.learnMoreLabel}<ArrowRight size={18} aria-hidden="true" /></summary>
            <p className={styles.detailCopy}>
              {onEdit ? <EditableText value={story.learnMoreCopy} label="learn more copy" onChange={(value) => onEdit("story.learnMoreCopy", value)} /> : story.learnMoreCopy}
            </p>
          </details>
        </article>

        <aside id="senior-companionship" className={styles.service} aria-labelledby="companionship-heading">
          <PanelLabel>{onEdit ? <EditableText value={servicesPreview.label} label="services label" onChange={(value) => onEdit("servicesPreview.label", value)} /> : servicesPreview.label}</PanelLabel>
          <h3 id="companionship-heading">{onEdit ? <EditableText value={servicesPreview.heading} label="services heading" onChange={(value) => onEdit("servicesPreview.heading", value)} /> : servicesPreview.heading}</h3>
          <ul className={styles.services}>
            {servicesPreview.services.map((service, index) => (
              <li key={index}><span>{onEdit ? <EditableText value={service} label={`service ${index + 1}`} onChange={(value) => onEdit(`servicesPreview.services.${index}`, value)} /> : service}</span><ArrowRight size={17} aria-hidden="true" /></li>
            ))}
          </ul>
          {onEdit ? <span className={`${styles.button} ${styles.serviceButton}`}><EditableText value={servicesPreview.buttonLabel} label="services button label" onChange={(value) => onEdit("servicesPreview.buttonLabel", value)} /><ArrowRight size={18} aria-hidden="true" /></span> : <Link href={servicesPreview.buttonLink} className={`${styles.button} ${styles.serviceButton}`}>{servicesPreview.buttonLabel}<ArrowRight size={18} aria-hidden="true" /></Link>}
        </aside>
      </div>
    </section>
  );
}
