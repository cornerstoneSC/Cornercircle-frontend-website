import { Music, Palette, PartyPopper, UsersRound } from "lucide-react";
import ConsultationSection from "./ConsultationSection";
import EventPlanningHero from "./EventPlanningHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import styles from "./CombinedServicesPage.module.css";

const experiences = [
  { icon: PartyPopper, title: "Celebrations", text: "Birthdays, holiday gatherings, appreciation events, and meaningful milestones." },
  { icon: Palette, title: "Creative programs", text: "Arts, crafts, themed workshops, and hands-on activities designed for the group." },
  { icon: Music, title: "Social experiences", text: "Music, tea parties, games, and welcoming opportunities to connect." },
  { icon: UsersRound, title: "Community outings", text: "Thoughtfully coordinated local outings with clear logistics and personal attention." },
];

export default function EventPlanningDetailsPage({ googleBookingUrl, content }: { googleBookingUrl?: string; content: CurrentServicesContent }) {
  return <div className={styles.page}>
    <EventPlanningHero content={content.eventPlanning}/>

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

    <ConsultationSection googleBookingUrl={googleBookingUrl} variant="event" id="event-consultation"/>
  </div>;
}
