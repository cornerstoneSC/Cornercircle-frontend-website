import Image from "next/image";
import styles from "./EventPlanningHero.module.css";

export default function EventPlanningHero() {
  return (
    <section className={styles.hero} aria-label="Event planning">
      <Image
        src="/images/services/event-planning-editorial-v3.png"
        alt="An inviting table prepared for a thoughtfully planned gathering"
        fill
        priority
        sizes="(max-width: 700px) calc(100vw - 32px), calc(100vw - 60px)"
        className={styles.image}
      />
      <h1 className={styles.title}>
        <span>Event</span> <em>Planning</em>
      </h1>
    </section>
  );
}
