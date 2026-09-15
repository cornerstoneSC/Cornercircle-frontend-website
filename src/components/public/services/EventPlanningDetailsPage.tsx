import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarHeart, ClipboardCheck, Music, Palette, PartyPopper, UsersRound } from "lucide-react";
import ConsultationPlanner from "./ConsultationPlanner";
import styles from "./CombinedServicesPage.module.css";

const experiences = [
  { icon: PartyPopper, title: "Celebrations", text: "Birthdays, holiday gatherings, appreciation events, and meaningful milestones." },
  { icon: Palette, title: "Creative programs", text: "Arts, crafts, themed workshops, and hands-on activities designed for the group." },
  { icon: Music, title: "Social experiences", text: "Music, tea parties, games, and welcoming opportunities to connect." },
  { icon: UsersRound, title: "Community outings", text: "Thoughtfully coordinated local outings with clear logistics and personal attention." },
];

export default function EventPlanningDetailsPage({ googleBookingUrl }: { googleBookingUrl?: string }) {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="event-planning-title">
      <div className={styles.heroCopy}>
        <Link className={styles.textLink} href="/services"><ArrowLeft size={17}/> All services</Link>
        <p className={styles.eyebrow}>Events &amp; group experiences</p>
        <h1 id="event-planning-title">Gatherings that feel personal, joyful, and well cared for.</h1>
        <p className={styles.lead}>We plan engaging experiences for retirement homes, senior communities, families, and local groups—from the first idea through the final detail.</p>
        <a className={styles.primaryButton} href="#event-consultation">Plan a free consultation</a>
      </div>
      <div className={styles.heroPhoto}><Image src="/images/services/companionship-garden.jpg" alt="Older adults enjoying a thoughtfully planned group gathering" fill priority sizes="(max-width: 820px) 100vw, 58vw"/></div>
    </section>

    <section className={styles.services} aria-labelledby="experiences-heading">
      <p className={styles.eyebrow}>Designed around your community</p>
      <h2 id="experiences-heading">What we can plan</h2>
      <p className={styles.sectionIntro}>Every experience is shaped around your audience, space, goals, accessibility needs, and budget.</p>
      <div className={styles.eventExperiences}>{experiences.map(({icon:Icon,title,text})=><article key={title}><span><Icon size={24}/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section id="process" className={styles.process} aria-labelledby="event-process-heading">
      <p className={styles.eyebrow}>A clear planning process</p><h2 id="event-process-heading">From idea to memorable experience</h2>
      <div className={styles.eventFlow}>
        <article><b>1</b><h3>Free consultation</h3><p>Tell us about your organization, audience, goals, timing, and budget.</p></article>
        <article><b>2</b><h3>Custom proposal</h3><p>We shape the concept, inclusions, staffing, schedule, and transparent pricing.</p></article>
        <article><b>3</b><h3>Review &amp; deposit</h3><p>Approve the written plan and secure your date with the stated deposit.</p></article>
        <article><b>4</b><h3>We coordinate</h3><p>Our team handles the agreed details and keeps your contact informed.</p></article>
      </div>
    </section>

    <section id="event-consultation" className={styles.consultation} aria-labelledby="event-consultation-heading">
      <div className={styles.consultationIntro}><p className={styles.eyebrow}>Start here</p><h2 id="event-consultation-heading">Tell us what you are planning</h2><p>Your complimentary 30-minute call comes first. It helps us confirm fit and prepare the right proposal—without requiring payment today.</p><ul><li><CalendarHeart size={18}/>30-minute conversation</li><li><ClipboardCheck size={18}/>Custom proposal after review</li><li><UsersRound size={18}/>One caring planning team</li></ul></div>
      <ConsultationPlanner googleBookingUrl={googleBookingUrl} initialType="event"/>
    </section>
  </div>;
}
