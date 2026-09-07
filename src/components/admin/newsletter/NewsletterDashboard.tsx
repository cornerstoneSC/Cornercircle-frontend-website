"use client";
import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Search, Users } from "lucide-react";
import {
  getNewsletterSubscribers,
  type NewsletterSubscriber,
} from "@/services/newsletter.service";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
export default function NewsletterDashboard() {
  const [data, setData] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      getNewsletterSubscribers(query, status)
        .then(setData)
        .catch((e) =>
          setError(
            e instanceof Error ? e.message : "Unable to load subscribers.",
          ),
        )
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, status]);
  const active = useMemo(
    () => data.filter((s) => s.status === "ACTIVE").length,
    [data],
  );
  function exportCsv() {
    const safe = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);
    const origin = window.location.origin;
    const rows = [
      ["Email", "Status", "Subscribed", "Unsubscribed", "Unsubscribe URL"],
      ...data.map((s) => [
        safe(s.email),
        s.status,
        s.subscribedAt,
        s.unsubscribedAt || "",
        `${origin}/newsletter/unsubscribe?token=${s.unsubscribeToken}`,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "cornerstone-newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="mx-auto w-full max-w-[1400px] p-6 md:p-10">
      <header className="flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a17834]">
            Community
          </p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">
            Newsletter
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Manage the people who joined your mailing list.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!data.length}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          <Download size={17} />
          Export CSV
        </button>
      </header>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <article className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5">
          <Users className="text-[#a17834]" />
          <div>
            <span className="text-xs text-stone-500">Active subscribers</span>
            <strong className="block text-2xl">{active}</strong>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5">
          <Mail className="text-[#657260]" />
          <div>
            <span className="text-xs text-stone-500">Showing</span>
            <strong className="block text-2xl">{data.length}</strong>
          </div>
        </article>
      </div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3">
          <Search size={17} />
          <input
            className="w-full py-2.5 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email…"
          />
        </label>
        <select
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>
      </div>
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Subscribed</th>
                <th className="px-5 py-4">Unsubscribed</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-t border-stone-100">
                  <td className="px-5 py-4 font-medium">{s.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${s.status === "ACTIVE" ? "bg-green-50 text-green-800" : "bg-stone-100 text-stone-600"}`}
                    >
                      {s.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {date.format(new Date(s.subscribedAt))}
                  </td>
                  <td className="px-5 py-4">
                    {s.unsubscribedAt
                      ? date.format(new Date(s.unsubscribedAt))
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !data.length && (
            <p className="p-8 text-center text-stone-500">
              No subscribers found.
            </p>
          )}
          {loading && (
            <p className="p-8 text-center text-stone-500">
              Loading subscribers…
            </p>
          )}
        </div>
      )}
    </section>
  );
}
