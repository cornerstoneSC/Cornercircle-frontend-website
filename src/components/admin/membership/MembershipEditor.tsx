"use client";

import { useEffect, useState } from "react";
import MembershipPage from "@/components/public/membership/MembershipPage";
import {
  defaultMembershipContent,
  type MembershipContent,
} from "@/lib/membership-content";
import {
  getMembershipContent,
  saveMembershipContent,
} from "@/services/membership-page.service";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

export default function MembershipEditor() {
  const [content, setContent] = useState<MembershipContent>(
    defaultMembershipContent,
  );
  const [saved, setSaved] = useState<MembershipContent>(
    defaultMembershipContent,
  );
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  useUnsavedChanges(dirty);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let active = true;
    getMembershipContent()
      .then((value) => {
        if (active) {
          setContent(value);
          setSaved(value);
          setReady(true);
        }
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Membership content.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await saveMembershipContent(content);
      setContent(result);
      setSaved(result);
      setNotice("Saved. Your Membership page changes are now published.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  function changeAnnualPrice(value: string) {
    const amount = Number(value);
    setError("");
    setNotice("");
    setContent((current) => ({
      ...current,
      annualPriceCents: Number.isFinite(amount) ? Math.round(amount * 100) : 0,
      price: Number.isFinite(amount) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount) : current.price,
    }));
  }

  function edit(path: string, value: string) {
    setNotice("");
    setError("");
    setContent((current) => {
      const next = structuredClone(current);
      const [field, index] = path.split(".");
      if (
        [
          "benefits",
          "stepLabels",
          "activities",
          "goals",
          "photographyParagraphs",
        ].includes(field)
      ) {
        (next[field as keyof MembershipContent] as string[])[Number(index)] =
          value;
      } else if (
        field in next &&
        typeof next[field as keyof MembershipContent] === "string"
      ) {
        Object.assign(next, { [field]: value });
      }
      return next;
    });
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f7f3ec]">
      {error && (
        <p
          role="alert"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 shadow-lg"
        >
          {notice}
        </p>
      )}
      <div className="z-40 flex shrink-0 items-end gap-4 border-b border-stone-200 bg-[#fcfaf7] px-5 py-4">
        <label className="grid gap-1.5 text-sm font-semibold text-stone-700">
          Annual membership price
          <span className="flex h-11 items-center overflow-hidden rounded-md border border-stone-300 bg-white focus-within:border-[#a18452] focus-within:ring-2 focus-within:ring-[#a18452]/20">
            <span className="border-r border-stone-200 px-3 text-stone-500">$</span>
            <input aria-label="Annual membership price in US dollars" type="number" min="1" max="10000" step="0.01" value={content.annualPriceCents / 100} onChange={(event) => changeAnnualPrice(event.target.value)} className="h-full w-40 px-3 outline-none" />
          </span>
        </label>
        <p className="max-w-xl pb-2 text-xs leading-5 text-stone-500">This is the real amount Stripe will charge each year for new memberships. Existing subscriptions keep their current price.</p>
      </div>
      {dirty && (
        <div className="z-40 flex shrink-0 items-center justify-end gap-3 border-b border-stone-200 bg-[#fcfaf7]/95 px-4 py-3 shadow-sm backdrop-blur">
          <span role="status" className="mr-auto text-xs text-stone-500">
            {saving ? "Saving…" : "Unsaved changes"}
          </span>
          <button
            disabled={saving}
            onClick={() => {
              setContent(saved);
              setError("");
            }}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 disabled:opacity-40"
          >
            Discard changes
          </button>
          <button
            disabled={!ready || saving}
            onClick={() => void save()}
            className="rounded-lg bg-[#a18452] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
      <section
        aria-label="Editable Membership page preview"
        inert={!ready || saving}
        className="flex min-h-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-[#f7f3ec] [container-type:inline-size]"
      >
        <MembershipPage content={content} onEdit={edit} editorMode />
      </section>
    </div>
  );
}
