import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./CompanionshipHero.module.css";

export default function CompanionshipHero({ imageSrc, photoControl }: { imageSrc: string; photoControl?: ReactNode }) {
  return <section className={styles.hero} aria-label="Personal companionship">
    <Image
      src={imageSrc}
      alt="An older adult and companion enjoying tea and conversation together"
      fill
      priority
      sizes="(max-width: 700px) calc(100vw - 32px), calc(100vw - 60px)"
      className={styles.image}
      unoptimized={imageSrc.startsWith("blob:")}
    />
    <h1 className={styles.title}><span>Personal</span> <em>Companionship</em></h1>
    {photoControl}
  </section>;
}
