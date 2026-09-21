import Image from "next/image";
import styles from "./CompanionshipHero.module.css";

export default function CompanionshipHero() {
  return <section className={styles.hero} aria-label="Personal companionship">
    <Image
      src="/images/services/companionship-hero-banner.png"
      alt="An older adult and companion enjoying tea and conversation together"
      fill
      priority
      sizes="(max-width: 700px) calc(100vw - 32px), calc(100vw - 60px)"
      className={styles.image}
    />
    <h1 className={styles.title}><span>Personal</span> <em>Companionship</em></h1>
  </section>;
}
