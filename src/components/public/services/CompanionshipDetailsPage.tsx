import Image from "next/image";
import { CalendarCheck, CalendarDays, Check, Coffee, HeartHandshake, MessagesSquare, Salad, ShieldCheck, ShoppingCart, Trees, UsersRound } from "lucide-react";
import styles from "./CompanionshipDetailsPage.module.css";
import ConsultationPlanner from "./ConsultationPlanner";

const options = [
  { icon: MessagesSquare, title: "Friendly visits", text: "Relaxed conversation, a shared hobby, games, music, or simply friendly company." },
  { icon: ShoppingCart, title: "Errands & shopping", text: "Friendly accompaniment for groceries, shopping, and everyday errands." },
  { icon: Trees, title: "Outings & activities", text: "Walks, cafés, community activities, appointments, and local outings." },
  { icon: Salad, title: "Shared meals", text: "Prepare a simple meal, dine together, and enjoy meaningful conversation." },
  { icon: CalendarDays, title: "Regular check-ins", text: "Recurring visits that provide connection, encouragement, and consistency." },
  { icon: UsersRound, title: "Family support", text: "Dependable companionship for a loved one when family cannot be present." },
];

const audiences = [
  "Older adults seeking connection and meaningful social interaction",
  "Families arranging companionship for a loved one",
  "People wanting company for errands, appointments, or outings",
  "Retirement-home residents seeking individual engagement",
];

export default function CompanionshipDetailsPage({ googleBookingUrl }: { googleBookingUrl?: string }) {
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><p className={styles.eyebrow}>Real connections. Brighter days.</p><h1>Companionship that makes everyday life feel brighter.</h1><p>Friendly, dependable company tailored to your interests, routines, and preferred pace.</p><div className={styles.actions}><a className={styles.goldButton} href="#consultation">Book a free 30-minute consultation</a><a className={styles.outlineButton} href="#options">Explore companionship options</a></div><ul><li><HeartHandshake />Meaningful moments</li><li><ShieldCheck />Thoughtful support</li><li><Coffee />A brighter tomorrow</li></ul></div>
      <div className={styles.heroImage}><Image src="/images/services/companionship-hero.jpg" alt="An older adult enjoying warm conversation with a companion" fill priority sizes="(max-width: 800px) 100vw, 60vw" /></div>
    </section>

    <section id="options" className={styles.options}><p className={styles.eyebrow}>Companionship options</p><h2>Time together, your way.</h2><p>Companionship looks different for everyone. Here are some of the ways we can spend time together.</p><div className={styles.optionGrid}>{options.map(({ icon: Icon, title, text }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={styles.audience}><div><p className={styles.eyebrow}>Personalized support</p><h2>Who companionship is for</h2><p>Our companionship services are designed for:</p><ul>{audiences.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div><div className={styles.audienceImage}><Image src="/images/services/companionship-garden.jpg" alt="An older adult and companion enjoying time outdoors" fill sizes="(max-width: 800px) 100vw, 45vw" /></div><blockquote>Life is brighter when it’s shared.</blockquote></section>

    <section className={styles.boundary}><ShieldCheck aria-hidden="true" /><div><h2>Companionship, not medical care.</h2><p>Cornerstone Social Circle provides non-medical companionship. We do not provide nursing, personal care, medication management, or emergency services.</p></div><p>Our focus is friendship, practical companionship, and meaningful time together — helping you live well and stay connected.</p></section>

    <section className={styles.pricingProcess}>
      <article className={styles.pricing}><p className={styles.eyebrow}>Simple, transparent pricing</p><h2>$75 <small>per hour</small></h2><strong>Two-hour minimum</strong><span>Starting total $150</span><p>Recurring and extended visits can be discussed during your consultation.</p></article>
      <div className={styles.process}><p className={styles.eyebrow}>How it works</p><h2>A simple process to get started.</h2><div>{[ ["1","Free 30-minute consultation","Required before your first paid visit."], ["2","Tell us your needs","We’ll learn about your interests, routines, and preferences."], ["3","Client approval","We’ll confirm the details and make sure it’s a good fit."], ["4","Book companionship","Once approved, choose your preferred visit dates."] ].map(([number,title,text]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div></div>
    </section>

    <section id="consultation" className={styles.consultation}><div><p className={styles.eyebrow}>Take the first step</p><h2>Let’s begin with a conversation.</h2><p>A friendly, no-obligation 30-minute consultation helps us understand your needs and explore how we can help.</p><ul><li><CalendarDays />30-minute appointment</li><li><CalendarCheck />Live availability</li><li><ShieldCheck />No payment today</li></ul></div><ConsultationPlanner googleBookingUrl={googleBookingUrl}/></section>
  </div>;
}
