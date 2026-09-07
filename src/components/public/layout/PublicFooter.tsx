import Image from "next/image";
import Link from "next/link";
import { Great_Vibes } from "next/font/google";
import styles from "./PublicFooter.module.css";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

const featureLinks = [
  { label: "About us", href: "/#our-story" },
  { label: "Become a member", href: "/membership" },
  { label: "Contact", href: "/contact" },
];

export default function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Cornerstone Social Circle homepage"
        >
          <Image
            src="/logo/cornerstone-logo-navbar-transparent.png"
            alt="Cornerstone Social Circle"
            width={1791}
            height={528}
          />
          <span aria-hidden="true">
            <i />◇<i />
          </span>
        </Link>
        <a
          className={styles.instagramIntro}
          href="https://www.instagram.com/cornerstonesocialcircle/"
          target="_blank"
          rel="noreferrer"
          aria-label="Follow Cornerstone Social Circle on Instagram"
        >
          <p className={script.className}>
            Follow along
            <br />
            on Instagram
          </p>
          <span>@cornerstonesocialcircle&nbsp; ↗</span>
        </a>
        <nav className={styles.features} aria-label="Featured footer links">
          {featureLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.divider} aria-hidden="true">
        <span>◇</span>
      </div>
      <div className={styles.bottom}>
        <p>© 2026 Cornerstone Social Circle</p>
        <nav className={styles.utility} aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.credits}>
          <a
            href="https://www.instagram.com/cornerstonesocialcircle/"
            target="_blank"
            rel="noreferrer"
            aria-label="Cornerstone Social Circle on Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <span aria-hidden="true" />
          <a
            href="https://www.gloria-djonret.com/"
            target="_blank"
            rel="noreferrer"
          >
            Developed by Gloria Djonret <b aria-hidden="true">↗</b>
          </a>
        </div>
      </div>
      <div className={styles.sageBand} aria-hidden="true" />
    </footer>
  );
}
