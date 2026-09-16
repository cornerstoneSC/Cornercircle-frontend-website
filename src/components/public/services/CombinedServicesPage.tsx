import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2, Leaf } from "lucide-react";
import ConsultationSection from "./ConsultationSection";
import styles from "./CombinedServicesPage.module.css";
import type { CurrentServicesContent } from "@/lib/services-content";

export default function CombinedServicesPage({ googleBookingUrl, content }: { googleBookingUrl?: string; content: CurrentServicesContent }) {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="services-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{content.main.eyebrow}</p>
        <h1 id="services-title">{content.main.title.split("\n").map((line,index)=><span key={line}>{index>0&&<br/>}{line}</span>)}</h1>
        <p className={styles.lead}>{content.main.description}</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#consultation">Book a free 30-minute consultation</a>
          <a className={styles.textLink} href="#process">See how it works <ArrowRight size={17} /></a>
        </div>
      </div>
      <div className={styles.heroPhoto}><Image src="/images/home/hero.jpg" alt="Members of the Cornerstone Social Circle community enjoying time together" fill priority sizes="(max-width: 820px) 100vw, 58vw" /></div>
    </section>

    <section className={styles.services} aria-labelledby="help-heading">
      <p className={styles.eyebrow}>Our services</p>
      <h2 id="help-heading">How can we help?</h2>
      <p className={styles.sectionIntro}>Two ways to make life richer — the same caring team, the same personal approach.</p>
      <div className={styles.editorialServiceGrid}>
        <Link className={styles.editorialServiceCard} href="/services/companionship" aria-label="Explore personal companionship">
          <span className={styles.editorialCardCopy}><Leaf aria-hidden="true"/><span><h3>Companionship</h3><small>Real connections. Richer days.</small><i aria-hidden="true"/><p>From shared interests to everyday outings, our team brings warmth, conversation, and joy to daily life.</p><strong>Explore companionship <ArrowRight size={17} aria-hidden="true"/></strong></span></span>
          <span className={styles.editorialCardPhoto}><Image src="/images/home/companionship-story.jpg" alt="An older adult enjoying a friendly walk with her companion" fill sizes="(max-width: 700px) 100vw, 25vw"/></span>
        </Link>
        <Link className={`${styles.editorialServiceCard} ${styles.eventServiceCard}`} href="/services/event-planning" aria-label="Explore event planning">
          <span className={styles.editorialCardCopy}><Flower2 aria-hidden="true"/><span><h3>Event planning</h3><small>Meaningful gatherings. Lasting memories.</small><i aria-hidden="true"/><p>Let our team handle the details, creating thoughtful experiences for your family, retirement home, or community.</p><strong>Explore event planning <ArrowRight size={17} aria-hidden="true"/></strong></span></span>
          <span className={styles.editorialCardPhoto}><Image src="/images/home/hero.jpg" alt="A thoughtfully arranged social gathering for older adults and their community" fill sizes="(max-width: 700px) 100vw, 25vw"/></span>
        </Link>
      </div>
    </section>

    <section id="process" className={styles.process} aria-labelledby="process-heading">
      <p className={styles.eyebrow}>Our process</p>
      <h2 id="process-heading">From conversation to connection</h2>
      <p className={styles.sectionIntro}>A simple, clear process for both services.</p>
      <div className={styles.flow}>
        <article><b>1</b><h3>Free consultation</h3><p className={styles.required}>Required before your first booking.</p></article>
        <ArrowRight className={styles.arrow} />
        <article><b>2</b><h3>Tell us your needs</h3><p>Share a few details about your goals, preferences, and schedule.</p></article>
        <div className={styles.branches}>
          <div><span>For personal companionship</span><article><b>3</b><h3>Client approval</h3><p>We’ll match you with the right support and confirm the plan.</p></article><ArrowRight className={styles.arrow} /><article><b>4</b><h3>Book a service</h3><p>Choose your preferred dates and get started.</p></article></div>
          <div><span>For events &amp; group experiences</span><article><b>3</b><h3>Custom proposal</h3><p>We’ll create a tailored proposal for your event.</p></article><ArrowRight className={styles.arrow} /><article><b>4</b><h3>Deposit &amp; confirm</h3><p>Review, submit a deposit, and we’ll take care of the rest.</p></article></div>
        </div>
      </div>
    </section>

    <ConsultationSection googleBookingUrl={googleBookingUrl}/>

    <section className={styles.bottomCta}><div><p className={styles.eyebrow}>Ready when you are</p><h2>A kinder, more connected tomorrow is within reach.</h2></div><Link className={styles.primaryButton} href="#consultation">Book your consultation</Link></section>
  </div>;
}
