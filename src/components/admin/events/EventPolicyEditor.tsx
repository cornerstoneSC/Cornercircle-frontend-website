"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Save, X } from "lucide-react";
import type { EventPolicyContent } from "@/app/(public)/event-terms/page";

export default function EventPolicyEditor() {
  const [content, setContent] = useState<EventPolicyContent | null>(null);
  const [saved, setSaved] = useState<EventPolicyContent | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/event-policy", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load the event policy.");
        return response.json();
      })
      .then((value: EventPolicyContent) => {
        setContent(value);
        setSaved(value);
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load the event policy.",
        ),
      );
  }, []);

  function updateSection(
    sectionIndex: number,
    paragraphIndex: number,
    value: string,
  ) {
    setContent((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      next.sections[sectionIndex].body[paragraphIndex] = value;
      return next;
    });
  }

  function updateSectionTitle(sectionIndex: number, value: string) {
    setContent((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      next.sections[sectionIndex].title = value;
      return next;
    });
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/event-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => null))?.message ||
            "Unable to save the event policy.",
        );
      const value = await response.json();
      setContent(value);
      setSaved(value);
      setEditing(false);
      setMessage("Saved. The public event policy is now updated.");
      window.setTimeout(() => setMessage(""), 3500);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to save the event policy.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!content)
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-[var(--event-muted)]">
        {error || "Loading event policy…"}
      </div>
    );

  const input =
    "w-full rounded-lg border border-[var(--event-border)] bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-[var(--event-accent-strong)]";
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-[var(--event-border)] pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--event-accent-strong)]">
            Website content
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--event-heading)]">
            Event policy
          </h1>
          <p className="mt-2 text-sm text-[var(--event-muted)]">
            Review the published policy, then click Edit to make changes.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/event-terms"
            target="_blank"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--event-border)] bg-white px-4 text-sm"
          >
            <Eye className="h-4 w-4" />
            View public page
          </a>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--event-accent)] px-5 text-sm font-semibold text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setContent(saved);
                  setEditing(false);
                  setError("");
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--event-border)] bg-white px-4 text-sm"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={() => void save()}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--event-accent)] px-5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </>
          )}
        </div>
      </header>
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-800"
        >
          {message}
        </p>
      )}
      <div className="mt-7 space-y-5">
        <section className="rounded-xl border border-[var(--event-border)] bg-white p-6">
          <label className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--event-muted)]">
            Effective date
          </label>
          {editing ? (
            <input
              className={`${input} mt-2`}
              value={content.effectiveDate}
              onChange={(e) =>
                setContent({ ...content, effectiveDate: e.target.value })
              }
            />
          ) : (
            <p className="mt-2 text-sm">{content.effectiveDate}</p>
          )}
          <label className="mt-5 block text-xs font-semibold uppercase tracking-[.12em] text-[var(--event-muted)]">
            Introduction
          </label>
          {editing ? (
            <textarea
              className={`${input} mt-2`}
              rows={3}
              value={content.introduction}
              onChange={(e) =>
                setContent({ ...content, introduction: e.target.value })
              }
            />
          ) : (
            <p className="mt-2 leading-7 text-[var(--event-text)]">
              {content.introduction}
            </p>
          )}
        </section>
        {content.sections.map((section, sectionIndex) => (
          <section
            key={sectionIndex}
            className="rounded-xl border border-[var(--event-border)] bg-white p-6"
          >
            {editing ? (
              <input
                className={`${input} font-serif text-xl`}
                value={section.title}
                onChange={(e) =>
                  updateSectionTitle(sectionIndex, e.target.value)
                }
              />
            ) : (
              <h2 className="font-serif text-2xl text-[var(--event-heading)]">
                {section.title}
              </h2>
            )}
            <div className="mt-4 space-y-3">
              {section.body.map((paragraph, paragraphIndex) =>
                editing ? (
                  <textarea
                    key={paragraphIndex}
                    className={input}
                    rows={Math.max(3, Math.ceil(paragraph.length / 100))}
                    value={paragraph}
                    onChange={(e) =>
                      updateSection(
                        sectionIndex,
                        paragraphIndex,
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  <p
                    key={paragraphIndex}
                    className="leading-7 text-[var(--event-text)]"
                  >
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
