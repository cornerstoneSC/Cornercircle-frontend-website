import { Great_Vibes } from "next/font/google";
import styles from "./EventsHero.module.css";

const script = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

export default function EventsHero() {
  return (
    <section className={styles.hero} aria-labelledby="events-heading">
      <div className={styles.inner}>
        <div className={styles.verticalMark} aria-hidden="true">
          <i />
          <span>Cornerstone Social Circle</span>
          <i />
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Gather with us</p>
          <h1 id="events-heading">
            Come as you are.<br />
            Leave a little more<br />
            <span>connected.</span>
          </h1>
          <p className={styles.intro}>
            Thoughtful gatherings for adults 21+ who value real conversation
            and authentic connection.
          </p>
        </div>

        <div className={styles.stationery} aria-hidden="true">
          <div className={styles.sagePaper} />
          <div className={styles.sealPaper}>
            <span className={styles.seal}>CSC</span>
          </div>
          <div className={styles.eventPaper}>
            <span className={styles.paperLine} />
            <div className={styles.words}>
              <span>Gather</span><i>·</i><span>Connect</span><i>·</i><span>Belong</span>
            </div>
            <span className={styles.paperLine} />
          </div>
          <p className={`${styles.note} ${script.className}`}>There is a seat for you.</p>
        </div>
      </div>
    </section>
  );
}
