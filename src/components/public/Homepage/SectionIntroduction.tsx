import type { ReactNode } from "react";
import { Great_Vibes } from "next/font/google";
import styles from "./SectionIntroduction.module.css";

const script = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

type SectionIntroductionProps = {
  introduction: ReactNode;
  accent: string;
  headingId?: string;
  editableIntroduction?: ReactNode;
  editableAccent?: ReactNode;
};

export default function SectionIntroduction({ introduction, accent, headingId, editableIntroduction, editableAccent }: SectionIntroductionProps) {
  const Accent = headingId ? "h2" : "p";

  return (
    <header className={styles.introduction}>
      <p className={styles.invitation}>{editableIntroduction ?? introduction}</p>
      <Accent id={headingId} className={`${styles.scriptAccent} ${script.className}`}>
        {editableAccent ?? accent}
        <svg className={styles.underline} viewBox="0 0 260 12" fill="none" aria-hidden="true">
          <path d="M3 8C65 2 167 2 257 7M24 10C96 5 169 4 228 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Accent>
    </header>
  );
}
