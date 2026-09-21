import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./EventPlanningHero.module.css";

export default function EventPlanningHero({ imageSrc, photoControl }: { imageSrc: string; photoControl?: ReactNode }) {
  return (
    <section className={styles.hero} aria-label="Event planning">
      <Image
        src={imageSrc}
        alt="An inviting table prepared for a thoughtfully planned gathering"
        fill
        priority
        sizes="(max-width: 700px) calc(100vw - 32px), calc(100vw - 60px)"
        className={styles.image}
        unoptimized={imageSrc.startsWith("blob:")}
      />
      <h1 className={styles.title}>
        <span>Event</span> <em>Planning</em>
      </h1>
      {photoControl}
    </section>
  );
}
