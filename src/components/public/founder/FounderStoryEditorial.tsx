import Image from "next/image";
import { UserRound } from "lucide-react";
import { Libre_Baskerville, Space_Mono } from "next/font/google";

import EditableText from "@/components/public/services/EditableText";
import type { FounderContent } from "@/types/homepage";

import styles from "./FounderStoryEditorial.module.css";

const bodyFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-founder-body",
});

const labelFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-founder-label",
});

const founderBrand = "Cornerstone Social Circle (CSC)";
const biographyEmphasis = [
  founderBrand,
  "Doctorate",
  "Master’s",
  "Bachelor's",
];
const biographyEmphasisPattern = new RegExp(
  `(${biographyEmphasis
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

function BiographyCopy({ value }: { value: string }) {
  return (
    <>
      {value.split(biographyEmphasisPattern).map((part, index) =>
        biographyEmphasis.includes(part) ? (
          <strong key={index}>{part}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

type Props = {
  content: FounderContent;
  imageUrl?: string;
  onEdit?: (path: string, value: string) => void;
  photoControls?: React.ReactNode;
};

const Copy = ({
  value,
  path,
  label,
  onEdit,
}: {
  value: string;
  path: string;
  label: string;
  onEdit?: Props["onEdit"];
}) =>
  onEdit ? (
    <EditableText
      value={value}
      label={label}
      onChange={(next) => onEdit(path, next)}
    />
  ) : (
    value
  );

export default function FounderStoryEditorial({
  content,
  imageUrl,
  onEdit,
  photoControls,
}: Props) {
  return (
    <article
      className={`${styles.page} ${bodyFont.variable} ${labelFont.variable}`}
    >
      <section
        className={styles.collage}
        aria-labelledby="founder-story-heading"
      >
        <div className={styles.backdrop} aria-hidden="true" />

        <div className={styles.portrait}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 760px) 88vw, 330px"
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <UserRound />
              <span>Founder portrait</span>
            </div>
          )}
          {photoControls}
        </div>

        <header className={styles.storyPanel}>
          <h1 id="founder-story-heading">
            <Copy
              value={content.storyEyebrow}
              path="storyEyebrow"
              label="founder story heading"
              onEdit={onEdit}
            />
          </h1>
          <div className={styles.biography}>
            {content.biography.map((paragraph, index) => (
              <p key={index}>
                {onEdit ? (
                  <Copy
                    value={paragraph}
                    path={`biography.${index}`}
                    label={`founder biography paragraph ${index + 1}`}
                    onEdit={onEdit}
                  />
                ) : (
                  <BiographyCopy value={paragraph} />
                )}
              </p>
            ))}
          </div>
        </header>
      </section>

      <section
        className={`${styles.editorial} ${
          content.personalNotes.length === 0 ? styles.editorialSolo : ""
        }`}
      >
        <div className={styles.vision}>
          <p className={styles.sectionLabel}>
            <Copy
              value={content.communityHeading}
              path="communityHeading"
              label="community section heading"
              onEdit={onEdit}
            />
          </p>
          <p className={styles.visionIntro}>
            <Copy
              value={content.communityIntro}
              path="communityIntro"
              label="community introduction"
              onEdit={onEdit}
            />
          </p>
          <h2>
            <Copy
              value={content.communityStatement}
              path="communityStatement"
              label="community statement"
              onEdit={onEdit}
            />
          </h2>
          <div className={styles.communityBody}>
            {content.communityBody.map((paragraph, index) => (
              <p key={index}>
                <Copy
                  value={paragraph}
                  path={`communityBody.${index}`}
                  label={`community paragraph ${index + 1}`}
                  onEdit={onEdit}
                />
              </p>
            ))}
          </div>
        </div>

        {content.personalNotes.length > 0 && (
          <aside className={styles.pillars}>
            {content.personalNotes.map((note, index) => (
              <article key={index}>
                <h3>
                  <Copy
                    value={note.title}
                    path={`personalNotes.${index}.title`}
                    label={`personal note ${index + 1} title`}
                    onEdit={onEdit}
                  />
                </h3>
                <p>
                  <Copy
                    value={note.description}
                    path={`personalNotes.${index}.description`}
                    label={`personal note ${index + 1} description`}
                    onEdit={onEdit}
                  />
                </p>
              </article>
            ))}
          </aside>
        )}
      </section>

    </article>
  );
}
