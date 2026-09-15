import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, MessageCircle, Sparkles, UsersRound } from "lucide-react";
import ConsultationPlanner from "./ConsultationPlanner";
import styles from "./CombinedServicesPage.module.css";

const benefits = [
  { icon: Heart, title: "Companionship", text: "Builds brighter days" },
  { icon: UsersRound, title: "Community", text: "Brings joy" },
  { icon: Sparkles, title: "Together", text: "We make life richer" },
];

export default function CombinedServicesPage({ googleBookingUrl }: { googleBookingUrl?: string }) {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="services-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>A more connected tomorrow</p>
        <h1 id="services-title">Meaningful companionship.<br />Memorable experiences.</h1>
        <p className={styles.lead}>Personalized companionship and thoughtfully planned events for individuals, families, retirement homes, and senior communities.</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#consultation">Book a free 30-minute consultation</a>
          <a className={styles.textLink} href="#process">See how it works <ArrowRight size={17} /></a>
        </div>
        <div className={styles.benefits}>{benefits.map(({ icon: Icon, title, text }) => <div key={title} className={styles.benefit}><span><Icon size={21} /></span><div><strong>{title}</strong><small>{text}</small></div></div>)}</div>
      </div>
      <div className={styles.heroPhoto}><Image src="/images/home/hero.jpg" alt="Members of the Cornerstone Social Circle community enjoying time together" fill priority sizes="(max-width: 820px) 100vw, 58vw" /></div>
    </section>

    <section className={styles.services} aria-labelledby="help-heading">
      <p className={styles.eyebrow}>Our services</p>
      <h2 id="help-heading">How can we help?</h2>
      <p className={styles.sectionIntro}>Two ways to make life richer — the same caring team, the same personal approach.</p>
      <div className={styles.serviceGrid}>
        <article className={styles.serviceCard}>
          <div className={styles.cardCopy}><h3>Personal<br />companionship</h3><p>Friendly visits, errands, outings, games, movies, and recurring support — all tailored to individual interests and needs.</p><a className={styles.cardButton} href="#consultation">Explore companionship</a></div>
          <div className={styles.cardPhoto}><Image src="/images/home/companionship-story.jpg" alt="A companion spending meaningful time with an older adult" fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
          <footer>Connection <span>•</span> Independence <span>•</span> A brighter everyday</footer>
        </article>
        <article className={styles.serviceCard}>
          <div className={styles.cardCopy}><h3>Events &amp; group<br />experiences</h3><p>Social gatherings, tea parties, arts and crafts, music, holiday celebrations, and community outings — thoughtfully planned and beautifully executed.</p><a className={styles.cardButton} href="#consultation">Explore event planning</a></div>
          <div className={styles.cardPhoto}><Image src="/images/services/companionship-garden.jpg" alt="Older adults taking part in a welcoming group activity" fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
          <footer>People <span>•</span> Celebration <span>•</span> Stronger communities</footer>
        </article>
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

    <section id="consultation" className={styles.consultation} aria-labelledby="consultation-heading">
      <div className={styles.consultationIntro}><p className={styles.eyebrow}>Take the first step</p><h2 id="consultation-heading">Start with a conversation</h2><p>A complimentary 30-minute consultation helps us understand your needs and explore the best options for you.</p><ul><li><MessageCircle size={18} />No obligation</li><li><CalendarDays size={18} />30 minutes</li><li><Heart size={18} />A more connected tomorrow</li></ul></div>
      <ConsultationPlanner googleBookingUrl={googleBookingUrl} />
    </section>

    <section className={styles.bottomCta}><div><p className={styles.eyebrow}>Ready when you are</p><h2>A kinder, more connected tomorrow is within reach.</h2></div><Link className={styles.primaryButton} href="#consultation">Book your consultation</Link></section>
  </div>;
}
