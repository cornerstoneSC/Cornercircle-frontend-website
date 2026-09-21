"use client";

import { useEffect, useRef, useState } from "react";
import { KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import useDialogFocus from "@/hooks/useDialogFocus";

type Admin = { id: number; displayName: string; email: string; lastSignInAt: string | null; active: boolean };
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "medium" });

async function api(path = "", options?: RequestInit) {
  const response = await fetch(`/api/admin/administrators${path}`, { cache: "no-store", ...options });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to update administrators.");
  return body;
}

export default function AdministratorsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number | string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    setLoading(true);
    try {
      const result = await api();
      if (!Array.isArray(result)) throw new Error("The administrator service returned an invalid response.");
      setAdmins(result);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load administrators.");
    } finally { setLoading(false); }
  }

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault(); setPending("add");
    try {
      await api("", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: name, email }) });
      setName(""); setEmail(""); setOpen(false); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to add administrator."); }
    finally { setPending(null); }
  }

  async function action(admin: Admin, kind: "reset-password" | "active") {
    setPending(admin.id);
    try {
      await api(`/${admin.id}/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: kind === "active" ? JSON.stringify({ active: !admin.active }) : undefined });
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update administrator."); }
    finally { setPending(null); }
  }

  return (
    <section className="min-h-full bg-[var(--event-canvas)] p-6 text-[var(--event-text)] md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--event-accent-strong)]">Access control</p><h1 className="mt-2 font-serif text-4xl text-[var(--event-heading)] md:text-5xl">Administrators</h1><p className="mt-3 text-[var(--event-muted)]">Manage who can access the Cornerstone admin workspace.</p></div>
          <button type="button" onClick={() => setOpen(true)} className="flex min-h-11 items-center gap-2 rounded-[var(--event-radius-sm)] bg-[var(--event-heading)] px-5 py-3 text-sm font-semibold text-white"><UserPlus size={17} />Add administrator</button>
        </header>
        <p className="mt-5 rounded-[var(--event-radius-sm)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Administrator access is powerful. Only add people who should manage community and website data.</p>
        {error && <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 border-l-4 border-[var(--event-danger)] bg-white px-4 py-3 text-sm text-[var(--event-danger)]"><span>{error}</span><button onClick={() => void load()} disabled={loading} className="font-semibold underline disabled:opacity-50">Try again</button></div>}
        <div className="mt-8 overflow-hidden rounded-[var(--event-radius-md)] border border-[var(--event-border)] bg-[var(--event-surface)]">
          {loading && <p className="p-10 text-center text-[var(--event-muted)]">Loading administrators…</p>}
          {!loading && admins.map((admin) => <article key={admin.id} className="flex flex-wrap items-center gap-4 border-b border-[var(--event-border)] p-5 last:border-0 md:flex-nowrap">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--event-accent-soft)] font-semibold text-[var(--event-accent-strong)]">{admin.displayName.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</div>
            <div className="min-w-0 flex-1"><h2 className="font-semibold text-[var(--event-heading)]">{admin.displayName}</h2><p className="truncate text-sm text-[var(--event-muted)]">{admin.email}</p><p className="mt-1 text-xs text-[var(--event-muted)]">{admin.lastSignInAt ? `Last sign-in ${date.format(new Date(admin.lastSignInAt))}` : "Has not signed in yet"}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${admin.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"}`}>{admin.active ? "Active" : "Disabled"}</span>
            <div className="flex flex-wrap gap-2"><button disabled={pending === admin.id || !admin.active} onClick={() => void action(admin, "reset-password")} className="flex min-h-11 items-center gap-2 rounded-[var(--event-radius-sm)] border border-[var(--event-border)] px-3 py-2 text-sm disabled:opacity-50"><KeyRound size={15} />Reset password</button><button disabled={pending === admin.id} onClick={() => void action(admin, "active")} className="min-h-11 rounded-[var(--event-radius-sm)] border border-[var(--event-border)] px-3 py-2 text-sm disabled:opacity-50">{admin.active ? "Disable" : "Enable"}</button></div>
          </article>)}
          {!loading && !error && !admins.length && <div className="p-10 text-center"><p className="font-semibold text-[var(--event-heading)]">No administrators yet</p><p className="mt-2 text-sm text-[var(--event-muted)]">Add the first administrator to enable account management.</p></div>}
        </div>
      </div>
      {open && <AddAdministratorDialog name={name} email={email} pending={pending === "add"} setName={setName} setEmail={setEmail} close={() => setOpen(false)} submit={add} />}
    </section>
  );
}

function AddAdministratorDialog({ name, email, pending, setName, setEmail, close, submit }: { name: string; email: string; pending: boolean; setName: (value: string) => void; setEmail: (value: string) => void; close: () => void; submit: (event: React.FormEvent) => void }) {
  const dialogRef = useRef<HTMLFormElement>(null);
  useDialogFocus(dialogRef, close);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="add-administrator-title" onSubmit={submit} className="w-full max-w-md rounded-[var(--event-radius-md)] bg-white p-7 shadow-2xl outline-none">
      <div className="mb-6 flex items-center gap-3"><ShieldCheck className="text-[var(--event-accent-strong)]" /><h2 id="add-administrator-title" className="font-serif text-3xl text-[var(--event-heading)]">Add administrator</h2></div>
      <label className="block text-sm font-medium">Full name<input autoFocus className="mt-2 h-12 w-full rounded border border-[var(--event-border)] px-3" value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <label className="mt-5 block text-sm font-medium">Email<input type="email" className="mt-2 h-12 w-full rounded border border-[var(--event-border)] px-3" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <p className="mt-4 text-xs leading-5 text-[var(--event-muted)]">They&apos;ll receive a secure link to create their password.</p>
      <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={close} className="min-h-11 px-4 py-2 text-sm">Cancel</button><button disabled={pending} className="min-h-11 rounded bg-[var(--event-heading)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Adding…" : "Add administrator"}</button></div>
    </form>
  </div>;
}
