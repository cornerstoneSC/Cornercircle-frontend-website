import Image from "next/image";
import styles from "./GallerySection.module.css";
import EditableText from "@/components/public/services/EditableText";
import { defaultHomepageContent } from "@/data/homepage";
import type { GalleryContent } from "@/types/homepage";
import type { ReactNode } from "react";

type GallerySectionProps = { images?: Array<string | undefined>; content?: GalleryContent; onEdit?: (path: string, value: string) => void; photoControls?: (index: number) => ReactNode };

const fallbacks = [
  "/images/home/hero.jpg",
  "/images/home/companionship-story.jpg",
  "/images/services/companionship-hero.jpg",
  "/images/services/companionship-garden.jpg",
  "/images/home/hero.jpg",
];

export default function GallerySection({ images = [], content = defaultHomepageContent.gallery, onEdit, photoControls }: GallerySectionProps) {
  const gallery = fallbacks.map((fallback, index) => content.imageUrls?.[index] || images[index] || fallback);

  return (
    <section className={styles.section} aria-labelledby="gallery-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="gallery-heading">
            <span>{onEdit ? <EditableText value={content.heading} label="gallery heading" onChange={(value) => onEdit("heading", value)} /> : content.heading}</span>
            <span><strong>{onEdit ? <EditableText value={content.accent} label="gallery accent" onChange={(value) => onEdit("accent", value)} /> : content.accent}</strong></span>
          </h2>
          <p>{onEdit ? <EditableText value={content.description} label="gallery description" onChange={(value) => onEdit("description", value)} /> : content.description}</p>
        </header>
        <div className={styles.gallery}>
          {gallery.map((src, index) => (
            <figure className={styles.photo + " " + styles["photo" + (index + 1)]} key={src + "-" + index}>
              <div className={styles.imageWrap}>
                <Image src={src} alt={content.imageAlt[index] || "Cornerstone community gathering"} fill unoptimized={src.startsWith("blob:")}
                  sizes={index === 2 ? "(max-width: 700px) 92vw, 50vw" : "(max-width: 700px) 44vw, 22vw"} className={styles.image} />
                {photoControls?.(index)}
              </div>
              {(index === 2 || index === 3) && <span className={index === 2 ? styles.pin : styles.corner} aria-hidden="true" />}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
