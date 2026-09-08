"use client";

import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import EditableText from "@/components/public/services/EditableText";
import { defaultMembershipContent, type MembershipContent } from "@/lib/membership-content";
import { createMembershipCheckout, MembershipRequestError, submitMembershipApplication } from "@/services/membership-application.service";
import styles from "./MembershipPage.module.css";

type Edit = (path: string, value: string) => void;

function Copy({ value, path, label, onEdit }: { value: string; path: string; label: string; onEdit?: Edit }) {
  return onEdit ? <EditableText value={value} label={label} onChange={(next) => onEdit(path, next)} /> : value;
}

function MembershipSummary({ content, onEdit }: { content: MembershipContent; onEdit?: Edit }) {
  return (
    <aside className={styles.summary} aria-labelledby="membership-summary-title">
      <p className={styles.summaryEyebrow}><Copy value={content.eyebrow} path="eyebrow" label="membership eyebrow" onEdit={onEdit} /></p>
      <span className={styles.watermark} aria-hidden="true">CSC</span>
      <h1 id="membership-summary-title"><Copy value={content.title} path="title" label="membership title" onEdit={onEdit} /></h1>
      <div className={styles.price}><span><Copy value={content.price} path="price" label="membership price" onEdit={onEdit} /></span><em><Copy value={content.pricePeriod} path="pricePeriod" label="price period" onEdit={onEdit} /></em></div>
      <p className={styles.tagline}><Copy value={content.tagline} path="tagline" label="membership tagline" onEdit={onEdit} /></p>
      <ul className={styles.benefits}>
        {content.benefits.map((benefit, index) => (
          <li key={index}><span className={styles.benefitIcon}><Check size={13} strokeWidth={1.8} /></span><Copy value={benefit} path={`benefits.${index}`} label={`benefit ${index + 1}`} onEdit={onEdit} /></li>
        ))}
      </ul>
    </aside>
  );
}

function StepTabs({ activeStep, highestStep, onSelect, labels, onEdit }: { activeStep: number; highestStep: number; onSelect: (step: number) => void; labels: string[]; onEdit?: Edit }) {
  return (
    <nav className={styles.tabs} aria-label="Membership application steps">
      {labels.map((label, index) => (
        <button
          key={index}
          type="button"
          className={`${styles.tab} ${activeStep === index ? styles.activeTab : ""}`}
          disabled={!onEdit && index > highestStep}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("[contenteditable]")) return;
            onSelect(index);
          }}
          aria-current={activeStep === index ? "step" : undefined}
          aria-label={`Step ${index + 1}: ${label}`}
        >
          <strong>{String(index + 1).padStart(2, "0")}</strong><span><Copy value={label} path={`stepLabels.${index}`} label={`step ${index + 1} label`} onEdit={onEdit} /></span>
        </button>
      ))}
    </nav>
  );
}

function TextField({ label, name, value, onChange, type = "text", required = false, error, maxLength, max }: {
  label: string; name: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; error?: string; maxLength?: number; max?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      <input name={name} type={type} required={required} value={value} maxLength={maxLength} max={max} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} onChange={(event) => onChange(event.target.value)} />
      {error && <small id={`${name}-error`} className={styles.fieldError}>{error}</small>}
    </label>
  );
}

function ChoiceGroup({ legend, name, choices, selected, onToggle, editPath, onEdit }: {
  legend: React.ReactNode; name: string; choices: string[]; selected: string[]; onToggle: (choice: string) => void; editPath: string; onEdit?: Edit;
}) {
  return (
    <fieldset className={styles.choiceGroup}>
      <legend>{legend}</legend>
      <div className={styles.choices}>
        {choices.map((choice, index) => (
          <label key={index} className={styles.choice}>
            <input type="checkbox" name={name} value={choice} checked={selected.includes(choice)} disabled={!!onEdit} onChange={() => onToggle(choice)} />
            <span className={styles.checkboxIndicator} aria-hidden="true" />
            <Copy value={choice} path={`${editPath}.${index}`} label={`${name} option ${index + 1}`} onEdit={onEdit} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function MembershipPage({ content = defaultMembershipContent, onEdit, editorMode = false }: { content?: MembershipContent; onEdit?: Edit; editorMode?: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [about, setAbout] = useState({ fullName: "", email: "", phone: "", city: "", birthday: "" });
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [inspiredBy, setInspiredBy] = useState("");
  const [membershipAgreement, setMembershipAgreement] = useState(false);
  const [photographyNotice, setPhotographyNotice] = useState(false);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateAbout(field: keyof typeof about, value: string) {
    setAbout((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => { const next = { ...current }; delete next[field]; return next; });
  }

  function toggleChoice(choice: string, setChoices: React.Dispatch<React.SetStateAction<string[]>>) {
    setChoices((current) => current.includes(choice) ? current.filter((item) => item !== choice) : [...current, choice]);
    setFieldErrors((current) => {
      const next = { ...current };
      if (setChoices === setSelectedActivities) delete next.activities;
      if (setChoices === setSelectedGoals) delete next.goals;
      return next;
    });
  }

  function validateAbout() {
    const errors: Record<string, string> = {};
    if (!about.fullName.trim()) errors.fullName = "Enter your full name.";
    else if (about.fullName.trim().length > 160) errors.fullName = "Use 160 characters or fewer.";
    const email = about.email.trim();
    if (!email) errors.email = "Enter your email address.";
    else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (about.phone.trim().length > 40) errors.phone = "Use 40 characters or fewer.";
    if (!about.city.trim()) errors.city = "Enter your city.";
    else if (about.city.trim().length > 120) errors.city = "Use 120 characters or fewer.";
    if (about.birthday && about.birthday >= new Date().toISOString().slice(0, 10)) errors.birthday = "Birthday must be before today.";
    return errors;
  }

  function validateInterests() {
    const errors: Record<string, string> = {};
    if (selectedActivities.length === 0) errors.activities = "Choose at least one activity.";
    if (selectedGoals.length === 0) errors.goals = "Choose at least one goal.";
    if (!inspiredBy.trim()) errors.inspiredBy = "Tell us what inspired you to join.";
    else if (inspiredBy.trim().length > 3000) errors.inspiredBy = "Use 3,000 characters or fewer.";
    return errors;
  }

  function continueFromAbout() {
    const errors = validateAbout();
    setFieldErrors(errors);
    if (Object.keys(errors).length) { setStatus("Please correct the highlighted fields."); return; }
    setHighestStep((current) => Math.max(current, 1));
    moveTo(1);
  }

  function continueFromInterests() {
    const errors = validateInterests();
    setFieldErrors(errors);
    if (Object.keys(errors).length) { setStatus("Please correct the highlighted fields."); return; }
    setHighestStep((current) => Math.max(current, 2));
    moveTo(2);
  }

  function moveTo(step: number) {
    setStatus("");
    setActiveStep(Math.max(0, Math.min(content.stepLabels.length - 1, step)));
    window.requestAnimationFrame(() => {
      document.getElementById("membership-form-heading")?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editorMode) { setStatus("Preview only — no application was submitted."); return; }
    const aboutErrors = validateAbout();
    if (Object.keys(aboutErrors).length) {
      setFieldErrors(aboutErrors);
      setActiveStep(0);
      setStatus("Please correct the highlighted fields before continuing.");
      return;
    }
    const interestErrors = validateInterests();
    if (Object.keys(interestErrors).length) {
      setFieldErrors(interestErrors);
      moveTo(1);
      window.requestAnimationFrame(() => setStatus("Please complete the interests and goals step before continuing to payment."));
      return;
    }
    const consentErrors: Record<string, string> = {};
    if (!membershipAgreement) consentErrors.membershipAgreementAccepted = "Accept the membership agreement to continue.";
    if (!photographyNotice) consentErrors.photographyNoticeAcknowledged = "Acknowledge the photography notice to continue.";
    if (comments.trim().length > 3000) consentErrors.comments = "Use 3,000 characters or fewer.";
    if (Object.keys(consentErrors).length) { setFieldErrors(consentErrors); setStatus("Please correct the highlighted fields."); return; }
    setFieldErrors({});
    setSubmitting(true);
    setStatus("Preparing your secure Stripe checkout…");
    try {
      const application = await submitMembershipApplication({
        ...about,
        birthday: about.birthday || null,
        inspiredBy,
        activities: selectedActivities,
        goals: selectedGoals,
        membershipAgreementAccepted: membershipAgreement,
        photographyNoticeAcknowledged: photographyNotice,
        comments,
      });
      const checkout = await createMembershipCheckout(application.applicationId);
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      if (error instanceof MembershipRequestError && Object.keys(error.fieldErrors).length) setFieldErrors(error.fieldErrors);
      setStatus(error instanceof Error ? error.message : "We couldn’t start secure checkout. Your card has not been charged.");
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page} data-editor-mode={editorMode || undefined}>
      <div className={styles.folio}>
        <MembershipSummary content={content} onEdit={onEdit} />

        <form className={styles.application} onSubmit={handleSubmit} noValidate>
          <div className={styles.formPage}>
            {activeStep === 0 && (
              <div className={styles.stepPanel}>
                <header className={styles.formHeader}>
                  <h2 id="membership-form-heading" tabIndex={-1}><Copy value={content.stepOneTitle} path="stepOneTitle" label="first step title" onEdit={onEdit} /></h2>
                  <span aria-hidden="true" />
                  <p><Copy value={content.stepOneIntro} path="stepOneIntro" label="first step introduction" onEdit={onEdit} /></p>
                </header>
                <div className={styles.fields}>
                  <TextField label="Full name" name="fullName" value={about.fullName} onChange={(value) => updateAbout("fullName", value)} required maxLength={160} error={fieldErrors.fullName} />
                  <TextField label="Email" name="email" value={about.email} onChange={(value) => updateAbout("email", value)} type="email" required maxLength={254} error={fieldErrors.email} />
                  <TextField label="Phone number" name="phone" value={about.phone} onChange={(value) => updateAbout("phone", value)} type="tel" maxLength={40} error={fieldErrors.phone} />
                  <TextField label="City" name="city" value={about.city} onChange={(value) => updateAbout("city", value)} required maxLength={120} error={fieldErrors.city} />
                  <TextField label="Birthday (optional)" name="birthday" value={about.birthday} onChange={(value) => updateAbout("birthday", value)} type="date" max={new Date(Date.now() - 86400000).toISOString().slice(0, 10)} error={fieldErrors.birthday} />
                </div>
                <p className={`${styles.status} ${status ? styles.errorStatus : ""}`} aria-live="polite">{status}</p>
                <div className={styles.firstStepFooter}>
                  <button type="button" className={styles.primaryButton} onClick={continueFromAbout}>
                    Save & continue <ArrowRight size={18} />
                  </button>
                  <p><LockKeyhole size={15} /> Complete payment after submitting your application.</p>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className={styles.stepPanel}>
                <header className={styles.formHeader}>
                  <h2 id="membership-form-heading" tabIndex={-1}><Copy value={content.stepTwoTitle} path="stepTwoTitle" label="second step title" onEdit={onEdit} /></h2>
                  <span aria-hidden="true" />
                  <p><Copy value={content.stepTwoIntro} path="stepTwoIntro" label="second step introduction" onEdit={onEdit} /></p>
                </header>
                <ChoiceGroup legend={<Copy value={content.activitiesLegend} path="activitiesLegend" label="activities heading" onEdit={onEdit} />} name="activities" choices={content.activities} selected={selectedActivities} onToggle={(choice) => toggleChoice(choice, setSelectedActivities)} editPath="activities" onEdit={onEdit} />
                {fieldErrors.activities && <p className={styles.fieldError}>{fieldErrors.activities}</p>}
                <ChoiceGroup legend={<Copy value={content.goalsLegend} path="goalsLegend" label="goals heading" onEdit={onEdit} />} name="goals" choices={content.goals} selected={selectedGoals} onToggle={(choice) => toggleChoice(choice, setSelectedGoals)} editPath="goals" onEdit={onEdit} />
                {fieldErrors.goals && <p className={styles.fieldError}>{fieldErrors.goals}</p>}
                <label className={styles.comments}>
                  <span>What inspired you to join CSC? *</span>
                  <textarea name="inspiredBy" rows={3} required maxLength={3000} aria-invalid={!!fieldErrors.inspiredBy} value={inspiredBy} onChange={(event) => { setInspiredBy(event.target.value); setFieldErrors((current) => { const next = { ...current }; delete next.inspiredBy; return next; }); }} />
                  {fieldErrors.inspiredBy && <small className={styles.fieldError}>{fieldErrors.inspiredBy}</small>}
                </label>
                <p className={`${styles.status} ${status ? styles.errorStatus : ""}`} aria-live="polite">{status}</p>
                <div className={styles.actions}>
                  <button type="button" className={styles.secondaryButton} onClick={() => moveTo(0)}>
                    <ArrowLeft size={17} /> Back
                  </button>
                  <button type="button" className={styles.primaryButton} onClick={continueFromInterests}>
                    Save & continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className={styles.stepPanel}>
                <header className={styles.formHeader}>
                  <h2 id="membership-form-heading" tabIndex={-1}><Copy value={content.stepThreeTitle} path="stepThreeTitle" label="third step title" onEdit={onEdit} /></h2>
                  <span aria-hidden="true" />
                  <p><Copy value={content.stepThreeIntro} path="stepThreeIntro" label="third step introduction" onEdit={onEdit} /></p>
                </header>

                <fieldset className={styles.agreementSection}>
                  <legend><Copy value={content.agreementTitle} path="agreementTitle" label="agreement heading" onEdit={onEdit} /></legend>
                  <label className={styles.longChoice}>
                    <input type="checkbox" name="membershipAgreement" required={!editorMode} disabled={editorMode} checked={membershipAgreement} onChange={(event) => { setMembershipAgreement(event.target.checked); setFieldErrors((current) => { const next = { ...current }; delete next.membershipAgreementAccepted; return next; }); }} />
                    <span className={styles.checkboxIndicator} aria-hidden="true" />
                    <span><Copy value={content.agreementText} path="agreementText" label="membership agreement" onEdit={onEdit} /></span>
                  </label>
                  <p className={styles.recurringDisclosure}>By continuing, I authorize a {content.price} annual charge that renews automatically each year until canceled. Cancellation takes effect at the end of the paid membership period.</p>
                  {fieldErrors.membershipAgreementAccepted && <p className={styles.fieldError}>{fieldErrors.membershipAgreementAccepted}</p>}
                </fieldset>

                <fieldset className={styles.notice}>
                  <legend><Copy value={content.photographyTitle} path="photographyTitle" label="photography notice heading" onEdit={onEdit} /></legend>
                  {content.photographyParagraphs.map((paragraph, index) => <p key={index}><Copy value={paragraph} path={`photographyParagraphs.${index}`} label={`photography paragraph ${index + 1}`} onEdit={onEdit} /></p>)}
                  <label className={styles.longChoice}>
                    <input type="checkbox" name="photographyNotice" required={!editorMode} disabled={editorMode} checked={photographyNotice} onChange={(event) => { setPhotographyNotice(event.target.checked); setFieldErrors((current) => { const next = { ...current }; delete next.photographyNoticeAcknowledged; return next; }); }} />
                    <span className={styles.checkboxIndicator} aria-hidden="true" />
                    <span><Copy value={content.photographyAcknowledgement} path="photographyAcknowledgement" label="photography acknowledgement" onEdit={onEdit} /></span>
                  </label>
                  {fieldErrors.photographyNoticeAcknowledged && <p className={styles.fieldError}>{fieldErrors.photographyNoticeAcknowledged}</p>}
                </fieldset>

                <label className={styles.comments}>
                  <span><Copy value={content.commentsLabel} path="commentsLabel" label="comments label" onEdit={onEdit} /></span>
                  <textarea name="comments" rows={3} maxLength={3000} aria-invalid={!!fieldErrors.comments} value={comments} onChange={(event) => setComments(event.target.value)} />
                  {fieldErrors.comments && <small className={styles.fieldError}>{fieldErrors.comments}</small>}
                </label>

                <div className={styles.actions}>
                  <button type="button" className={styles.secondaryButton} onClick={() => moveTo(1)}>
                    <ArrowLeft size={17} /> Back
                  </button>
                  <button type="submit" className={styles.primaryButton} disabled={submitting}>
                    {submitting ? "Preparing secure checkout…" : "Submit & continue to payment"} {!submitting && <ArrowRight size={18} />}
                  </button>
                </div>
                <p className={styles.feeNote}>Your membership is {content.price} per year and renews automatically until canceled. Confirm the final amount shown in Stripe before paying.</p>
                <p className={`${styles.status} ${status && !submitting ? styles.errorStatus : ""}`} aria-live="polite">{status}</p>
              </div>
            )}

            <div className={styles.seal} aria-hidden="true"><span>Cornerstone</span><strong>CSC</strong><span>Social Circle</span></div>
          </div>
          <StepTabs activeStep={activeStep} highestStep={editorMode ? content.stepLabels.length - 1 : highestStep} onSelect={moveTo} labels={content.stepLabels} onEdit={onEdit} />
        </form>
      </div>
    </section>
  );
}
