import { ArrowRight, CalendarDays, UsersRound } from "lucide-react";
import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "./ContactForm";
import styles from "./ContactPage.module.css";
import { defaultContactContent, type ContactContent } from "@/lib/contact-content";
import type { ReactNode } from "react";

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

export default function ContactPage({ enquiryEmail, content = defaultContactContent, onEdit, photoControl }: { enquiryEmail?: string; content?: ContactContent; onEdit?: (path: string, value: string) => void; photoControl?: ReactNode }) {
  const editable = (key: keyof ContactContent, className?: string) => ({
    className,
    contentEditable: !!onEdit,
    suppressContentEditableWarning: true,
    onBlur: onEdit ? (event: React.FocusEvent<HTMLElement>) => onEdit(key, event.currentTarget.innerText) : undefined,
  });
  return (
    <section className={styles.page}>
      <div className={styles.editorialGrid}>
        <div className={styles.verticalMark} aria-hidden="true"><i /><span>Cornerstone Social Circle</span><i /></div>
        <div className={styles.leftColumn}>
          <header className={styles.contactHeading}>
            <p {...editable("eyebrow")}>{content.eyebrow}</p>
            <h1><span {...editable("title", styles.titleLead)}>{content.title}</span><br /><span {...editable("accentTitle")}>{content.accentTitle}</span></h1>
            <p {...editable("description", styles.introCopy)}>{content.description}</p>
          </header>
          <div className={styles.photoWrap}>
            <span className={styles.pin} aria-hidden="true" />
            <div className={styles.photo}>
              <Image src={content.imageUrl} alt={content.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" unoptimized={content.imageUrl.startsWith("blob:")} />
            </div>
            {photoControl}
            <p {...editable("imageNote", styles.note)}>{content.imageNote}</p>
          </div>
        </div>
        <div className={styles.formColumn}>
          <div className={styles.formKicker}><span {...editable("formLabel")}>{content.formLabel}</span><i /></div>
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
