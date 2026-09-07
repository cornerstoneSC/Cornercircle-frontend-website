import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  UserRound,
  UsersRound,
} from "lucide-react";
import EditableText from "@/components/public/services/EditableText";
import type { FounderContent } from "@/types/homepage";
import styles from "./FounderStory.module.css";

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
export default function FounderStory({
  content,
  imageUrl,
  onEdit,
  photoControls,
}: Props) {
  const icons = [MessageCircle, HeartHandshake, UsersRound];
  return (
    <article className={styles.page}>
      <header>
        <p>
          <Copy
            value={content.storyEyebrow}
            path="storyEyebrow"
            label="founder story eyebrow"
            onEdit={onEdit}
          />
        </p>
        <h1>
          <Copy
            value={content.name}
            path="name"
            label="founder name"
            onEdit={onEdit}
          />
        </h1>
        <em>
          <Copy
            value={content.storySubtitle}
            path="storySubtitle"
            label="founder subtitle"
            onEdit={onEdit}
          />
        </em>
      </header>
      <div className={styles.portrait}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={content.imageAlt}
            fill
            sizes="760px"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <UserRound />
            <span>Founder portrait</span>
          </div>
        )}
        {photoControls}
        <blockquote>
          “
          <span>
            <Copy
              value={content.quote}
              path="quote"
              label="founder portrait quote"
              onEdit={onEdit}
            />
          </span>
        </blockquote>
      </div>
      <section className={styles.story}>
        <aside>Her Story</aside>
        <div className={styles.bio}>
          {content.biography.map((p, i) => (
            <p key={i}>
              <Copy
                value={p}
                path={`biography.${i}`}
                label={`founder biography paragraph ${i + 1}`}
                onEdit={onEdit}
              />
            </p>
          ))}
        </div>
        <div className={styles.credentials}>
          <h2>
            <Copy
              value={content.credentialsHeading}
              path="credentialsHeading"
              label="credentials heading"
              onEdit={onEdit}
            />
          </h2>
          {content.credentials.map((item, i) => (
            <div key={i}>
              <GraduationCap />
              <p>
                <Copy
                  value={item}
                  path={`credentials.${i}`}
                  label={`credential ${i + 1}`}
                  onEdit={onEdit}
                />
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.vision}>
        <h2>
          <Copy
            value={content.visionHeading}
            path="visionHeading"
            label="vision heading"
            onEdit={onEdit}
          />
        </h2>
        <p>
          <Copy
            value={content.visionIntroduction}
            path="visionIntroduction"
            label="vision introduction"
            onEdit={onEdit}
          />
        </p>
        <div>
          {content.pillars.map((pillar, i) => {
            const Icon = icons[i];
            return (
              <article key={i}>
                <i>
                  <Icon />
                </i>
                <h3>
                  <Copy
                    value={pillar.title}
                    path={`pillars.${i}.title`}
                    label={`pillar ${i + 1} title`}
                    onEdit={onEdit}
                  />
                </h3>
                <p>
                  <Copy
                    value={pillar.description}
                    path={`pillars.${i}.description`}
                    label={`pillar ${i + 1} description`}
                    onEdit={onEdit}
                  />
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <footer>
        <blockquote>
          <Copy
            value={content.closingQuote}
            path="closingQuote"
            label="closing founder quote"
            onEdit={onEdit}
          />
        </blockquote>
        <nav>
          {onEdit ? (
            <>
              <span>{content.eventsButtonLabel}</span>
              <span>{content.membershipButtonLabel}</span>
            </>
          ) : (
            <>
              <Link href={content.eventsButtonLink}>
                {content.eventsButtonLabel}
              </Link>
              <Link href={content.membershipButtonLink}>
                {content.membershipButtonLabel}
              </Link>
            </>
          )}
        </nav>
      </footer>
    </article>
  );
}
