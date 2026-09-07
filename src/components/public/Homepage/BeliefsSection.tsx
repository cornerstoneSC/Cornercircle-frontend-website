import Image from "next/image";
import { Caveat } from "next/font/google";
import { Fingerprint, Heart, Sparkles, Sun, Users, UsersRound, type LucideIcon } from "lucide-react";
import SectionIntroduction from "./SectionIntroduction";
import styles from "./BeliefsSection.module.css";
import type { ReactNode } from "react";
import EditableText from "@/components/public/services/EditableText";
import { defaultHomepageContent } from "@/data/homepage";
import type { BeliefsContent } from "@/types/homepage";

const handwriting = Caveat({ subsets: ["latin"], weight: "400", display: "swap" });
const icons: LucideIcon[] = [Users, Heart, Fingerprint, UsersRound, Sparkles, Sun];

function BeliefItem({ belief, icon: Icon, index, onEdit }: { belief: BeliefsContent["items"][number]; icon: LucideIcon; index: number; onEdit?: (path: string, value: string) => void }) {
  return (
    <article className={styles.belief}>
      <Icon className={styles.icon} strokeWidth={1.2} aria-hidden="true" />
      <div>
        <h3>{onEdit ? <EditableText value={belief.title} label={`belief ${index + 1} title`} onChange={(value) => onEdit(`items.${index}.title`, value)} /> : belief.title}</h3>
        <p>{onEdit ? <EditableText value={belief.description} label={`belief ${index + 1} description`} onChange={(value) => onEdit(`items.${index}.description`, value)} /> : belief.description}</p>
      </div>
    </article>
  );
}

export default function BeliefsSection({ imageUrl, photoControls, content = defaultHomepageContent.beliefs, onEdit }: { imageUrl?: string; photoControls?: ReactNode; content?: BeliefsContent; onEdit?: (path: string, value: string) => void }) {
  const photo = imageUrl || "/images/home/hero.jpg";
  return (
    <section aria-labelledby="beliefs-heading" className={styles.section}>
      <div className={styles.inner}>
        <SectionIntroduction introduction={content.introduction} accent={content.accent} headingId="beliefs-heading"
          editableIntroduction={onEdit && <EditableText value={content.introduction} label="beliefs introduction" onChange={(value) => onEdit("introduction", value)} />}
          editableAccent={onEdit && <EditableText value={content.accent} label="beliefs accent" onChange={(value) => onEdit("accent", value)} />} />
        <div className={styles.keepsake}>
          <div className={styles.photo}>
            <div className={styles.photoFrame}>
              <Image src={photo} alt={content.imageAlt} fill
                unoptimized={photo.startsWith("blob:")}
                sizes="(max-width: 699px) 55vw, 340px" className={styles.photoImage} />
              {photoControls}
            </div>
          </div>
          <div className={styles.note}>
            <span className={styles.clip} aria-hidden="true"><span /><i /></span>
            <blockquote className={handwriting.className}>
              {onEdit ? <EditableText value={content.statement} label="beliefs statement" onChange={(value) => onEdit("statement", value)} /> : content.statement}
            </blockquote>
            <Heart className={styles.noteHeart} strokeWidth={1.2} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.beliefs}>
          {content.items.map((belief, index) => <BeliefItem key={index} belief={belief} icon={icons[index]} index={index} onEdit={onEdit} />)}
        </div>
      </div>
    </section>
  );
}
