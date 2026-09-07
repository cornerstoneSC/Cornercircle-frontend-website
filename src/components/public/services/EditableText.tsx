"use client";

import { useEffect, useRef, useState } from "react";

type EditableTextProps = {
  value: string;
  label: string;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
};

function defaults(label: string) {
  const name = label.toLowerCase();
  const short = /button|label|eyebrow|price|period|tab|service \d|step \d label/.test(name);
  const long = /description|copy|paragraph|agreement|notice|answer|introduction|intro|statement/.test(name);
  return { maxLength: short ? 60 : long ? 3000 : 160, multiline: long };
}

export default function EditableText({ value, label, onChange, maxLength, multiline }: EditableTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const original = useRef(value);
  const [error, setError] = useState("");
  const configuration = defaults(label);
  const limit = maxLength ?? configuration.maxLength;
  const allowsLines = multiline ?? configuration.multiline;
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) ref.current.innerText = value;
  }, [value]);
  function apply(raw: string) {
    const next = allowsLines ? raw.replace(/\n{3,}/g, "\n\n") : raw.replace(/\s*\n\s*/g, " ");
    if (!next.trim()) { setError("This text cannot be empty."); return false; }
    if (next.length > limit) { setError(`Use ${limit} characters or fewer.`); return false; }
    setError(""); onChange(next); return true;
  }
  return <span ref={ref} contentEditable="plaintext-only" suppressContentEditableWarning role="textbox" aria-label={`Edit ${label}`} aria-multiline={allowsLines} aria-invalid={!!error} tabIndex={0}
    title={error || `Click to edit. ${allowsLines ? "Click outside" : "Press Enter"} to apply. Escape to cancel. Maximum ${limit} characters.`}
    className={`cursor-text whitespace-pre-line rounded-sm outline-offset-4 hover:outline hover:outline-1 hover:outline-[#b69a64] focus:outline focus:outline-2 ${error ? "outline outline-2 outline-red-500 focus:outline-red-500" : "focus:outline-[#a18452]"}`}
    style={{ display: "inline-block", minWidth: "1ch", minHeight: "1em", maxWidth: "100%" }}
    onClick={(event) => { event.stopPropagation(); }}
    onFocus={() => { original.current = value; setError(""); }}
    onInput={(event) => { apply(event.currentTarget.innerText); }}
    onPaste={(event) => { event.preventDefault(); const text = event.clipboardData.getData("text/plain"); document.execCommand("insertText", false, text); }}
    onKeyDown={(event) => { event.stopPropagation(); if (event.key === "Enter" && !allowsLines) { event.preventDefault(); event.currentTarget.blur(); } if (event.key === "Escape") { event.preventDefault(); event.currentTarget.innerText = original.current; setError(""); onChange(original.current); event.currentTarget.blur(); } }}
    onBlur={(event) => {
      const next = event.currentTarget.innerText.trim();
      if (!apply(next)) { event.currentTarget.innerText = value; return; }
    }} />;
}
