import { ArrowRight, CalendarDays, UsersRound } from "lucide-react";
import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "./ContactForm";
import styles from "./ContactPage.module.css";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const shortcuts = [
  {
    eyebrow: "Looking for companionship?",
    label: "Explore Services",
    href: "/services",
    icon: UsersRound,
    external: false,
  },
  {
    eyebrow: "Ready to meet your circle?",
    label: "Browse Events",
    href: "/events",
    icon: CalendarDays,
    external: false,
  },
  {
    eyebrow: "Follow our circle",
    label: "@cornerstonesocialcircle",
    href: "https://www.instagram.com/cornerstonesocialcircle/",
    icon: InstagramIcon,
    external: true,
  },
] as const;

export default function ContactPage({ enquiryEmail }: { enquiryEmail?: string }) {
  return (
    <section className={styles.page}>
      <div className={styles.editorialGrid}>
        <div className={styles.verticalMark} aria-hidden="true"><i /><span>Cornerstone Social Circle</span><i /></div>
        <div className={styles.leftColumn}>
          <header className={styles.contactHeading}>
            <p>Get in touch</p>
            <h1>Let&apos;s begin a<br /><span>conversation.</span></h1>
            <p className={styles.introCopy}>Whether you are curious about an event, membership, companionship, or simply want to say hello, there is a place for your message here.</p>
          </header>
          <div className={styles.photoWrap}>
            <span className={styles.pin} aria-hidden="true" />
            <div className={styles.photo}>
              <Image src="/images/services/companionship-hero.jpg" alt="Two women enjoying tea and conversation together" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <p className={styles.note}>Connection<br />starts with hello.</p>
          </div>
        </div>
        <div className={styles.formColumn}>
          <div className={styles.formKicker}><span>Write to us</span><i /></div>
          <div className={styles.formCard}><ContactForm email={enquiryEmail} /></div>
          <p className={styles.responseNote}><strong>01</strong><span>Send your note</span><i /><strong>02</strong><span>We&apos;ll be in touch</span></p>
        </div>
      </div>

      <nav className={styles.shortcuts} aria-label="Contact page shortcuts">
        {shortcuts.map(({ eyebrow, label, href, icon: Icon, external }) => {
          const content = (
            <>
              <span className={styles.shortcutIcon}><Icon aria-hidden="true" /></span>
              <span className={styles.shortcutCopy}>
                <strong>{eyebrow}</strong>
                <span>{label} <ArrowRight aria-hidden="true" /></span>
              </span>
            </>
          );

          return external ? (
            <a key={href} href={href} target="_blank" rel="noreferrer" className={styles.shortcut}>
              {content}
            </a>
          ) : (
            <Link key={href} href={href} className={styles.shortcut}>
              {content}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
