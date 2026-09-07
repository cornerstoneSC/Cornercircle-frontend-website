import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import EditableText from "@/components/public/services/EditableText";
import type { FounderContent } from "@/types/homepage";
import styles from "./FounderSection.module.css";

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

export default function FounderSection({
  content,
  imageUrl,
  onEdit,
  photoControls,
}: Props) {
  return (
    <section className={styles.section} aria-labelledby="founder-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Copy
              value={content.eyebrow}
              path="eyebrow"
              label="founder eyebrow"
              onEdit={onEdit}
            />
          </p>
          <h2 id="founder-heading">
            <Copy
              value={content.name}
              path="name"
              label="founder name"
              onEdit={onEdit}
            />
          </h2>
          <span className={styles.rule} />
          <p className={styles.preview}>
            <Copy
              value={content.preview}
              path="preview"
              label="founder biography preview"
              onEdit={onEdit}
            />
          </p>
          {onEdit ? (
            <>
              <span className={styles.button}>
                <Copy
                  value={content.buttonLabel}
                  path="buttonLabel"
                  label="founder button"
                  onEdit={onEdit}
                />
              </span>
              <small className={styles.editorMeta}>
                Destination:{" "}
                <Copy
                  value={content.buttonLink}
                  path="buttonLink"
                  label="founder button destination"
                  onEdit={onEdit}
                />
              </small>
            </>
          ) : (
            <Link className={styles.button} href={content.buttonLink}>
              {content.buttonLabel}
            </Link>
          )}
        </div>
        <div className={styles.portrait}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 800px) 100vw, 44vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <UserRound />
              <span>Upload Dr. Touglo’s portrait in the admin editor</span>
            </div>
          )}
          {photoControls}
          {onEdit && (
            <small className={styles.editorAlt}>
              Photo description:{" "}
              <Copy
                value={content.imageAlt}
                path="imageAlt"
                label="founder image description"
                onEdit={onEdit}
              />
            </small>
          )}
        </div>
      </div>
    </section>
  );
}
