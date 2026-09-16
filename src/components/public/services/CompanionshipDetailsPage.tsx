import { CalendarDays, Check, MessagesSquare, Salad, ShieldCheck, ShoppingCart, Trees, UsersRound } from "lucide-react";
import styles from "./CompanionshipDetailsPage.module.css";
import ConsultationSection from "./ConsultationSection";
import CompanionshipHero from "./CompanionshipHero";
import type { CurrentServicesContent } from "@/lib/services-content";
import EditableText from "./EditableText";

const options = [
  { icon: MessagesSquare, title: "Friendly visits", text: "Relaxed conversation, a shared hobby, games, music, or simply friendly company." },
  { icon: ShoppingCart, title: "Errands & shopping", text: "Friendly accompaniment for groceries, shopping, and everyday errands." },
  { icon: Trees, title: "Outings & activities", text: "Walks, cafés, community activities, appointments, and local outings." },
  { icon: Salad, title: "Shared meals", text: "Prepare a simple meal, dine together, and enjoy meaningful conversation." },
  { icon: CalendarDays, title: "Regular check-ins", text: "Recurring visits that provide connection, encouragement, and consistency." },
  { icon: UsersRound, title: "Family support", text: "Dependable companionship for a loved one when family cannot be present." },
];

export default function CompanionshipDetailsPage({ googleBookingUrl, content, onEdit, onEditAudience }: { googleBookingUrl?: string; content: CurrentServicesContent; onEdit?: (field: string, value: string) => void; onEditAudience?: (index: number, value: string) => void }) {
  const editable = (field: "hourlyRate" | "minimum" | "startingTotal" | "primaryCta", value: string) => onEdit
    ? <EditableText value={value} label={`Companionship ${field}`} onChange={(next) => onEdit(field, next)} maxLength={100}/>
    : value;
  return <div className={styles.page}>
    <CompanionshipHero content={content.companionship} onEdit={onEdit}/>

    <section id="options" className={styles.options}><p className={styles.eyebrow}>Companionship options</p><h2>Time together, your way.</h2><p>Companionship looks different for everyone. Here are some of the ways we can spend time together.</p><div className={styles.optionGrid}>{options.map(({ icon: Icon, title, text }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={styles.audiencePricing} aria-labelledby="audience-heading">
      <svg className={styles.audienceBotanical} viewBox="0 0 150 420" aria-hidden="true"><path d="M18 420C24 304 35 198 63 82M32 315C63 277 91 250 126 233M42 252C17 220 10 184 17 145M50 189C81 155 105 132 135 119M29 337C13 316 5 291 6 264"/><path d="M17 146C1 181 7 219 42 252C47 211 38 175 17 146ZM135 119C96 126 70 149 50 189C91 180 120 157 135 119ZM126 233C86 236 57 264 32 315C77 299 108 272 126 233ZM6 264C-1 293 7 318 29 337C34 307 25 282 6 264Z"/></svg>
      <div className={styles.audienceCopy}><p className={styles.eyebrow}>Personalized support</p><h2 id="audience-heading">Who companionship<br/>is for</h2><p>Our companionship services are designed for:</p><ul>{content.companionship.audience.map((item, index) => <li key={index}><Check aria-hidden="true" />{onEditAudience ? <EditableText value={item} label={`Audience item ${index + 1}`} onChange={(next) => onEditAudience(index, next)} multiline maxLength={240}/> : item}</li>)}</ul><blockquote>Life is brighter when it’s shared.</blockquote></div>
      <article className={styles.premiumPricing}><p className={styles.eyebrow}>Simple, transparent pricing</p><h2>{editable("hourlyRate", content.companionship.hourlyRate)} <small>/ hour</small></h2><hr/><strong>{editable("minimum", content.companionship.minimum)}</strong><span>{editable("startingTotal", content.companionship.startingTotal)}</span><hr/><p>Recurring and extended visits can be discussed during your consultation.</p><a href="#consultation">{editable("primaryCta", content.companionship.primaryCta)} <span aria-hidden="true">→</span></a><small>No obligation. Just a conversation.</small></article>
    </section>

    <section className={styles.boundary}><ShieldCheck aria-hidden="true" /><div><h2>Companionship, not medical care.</h2><p>Cornerstone Social Circle provides non-medical companionship. We do not provide nursing, personal care, medication management, or emergency services.</p></div><p>Our focus is friendship, practical companionship, and meaningful time together — helping you live well and stay connected.</p></section>

    <section className={styles.processSection}>
      <div className={styles.process}><p className={styles.eyebrow}>How it works</p><h2>A simple process to get started.</h2><div>{[ ["1","Free 30-minute consultation","Required before your first paid visit."], ["2","Tell us your needs","We’ll learn about your interests, routines, and preferences."], ["3","Client approval","We’ll confirm the details and make sure it’s a good fit."], ["4","Book companionship","Once approved, choose your preferred visit dates."] ].map(([number,title,text]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div></div>
    </section>

    <ConsultationSection googleBookingUrl={googleBookingUrl} variant="companionship"/>
  </div>;
}
