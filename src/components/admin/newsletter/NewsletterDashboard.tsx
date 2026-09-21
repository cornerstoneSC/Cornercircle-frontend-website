"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Mail, RefreshCw, Search, Users } from "lucide-react";
import {
  getNewsletterSubscribers,
  retryNewsletterSubscriber,
  type NewsletterSubscriber,
} from "@/services/newsletter.service";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const PAGE_SIZE = 12;
export default function NewsletterDashboard() {
  const [data, setData] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
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
  const pageCount = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  async function retrySubscriber(id: number) {
    setRetrying(id);
    setError("");
    try {
      const updated = await retryNewsletterSubscriber(id);
      setData((current) =>
        current.map((subscriber) =>
          subscriber.id === updated.id ? updated : subscriber,
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to retry synchronization.",
      );
    } finally {
      setRetrying(null);
    }
  }
  function exportCsv() {
    const safe = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);
    const rows = [
      ["Email", "Status", "Source", "Resend status", "Subscribed", "Unsubscribed"],
      ...data.map((s) => [
        safe(s.email),
        s.status,
        s.source || "website",
        s.resendSyncStatus,
        s.subscribedAt,
        s.unsubscribedAt || "",
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
      <div className="my-6 grid gap-4 sm:grid-cols-3">
        <article className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5">
          <Users className="text-[#a17834]" />
          <div>
            <span className="text-xs text-stone-500">Active subscribers</span>
            <strong className="block text-2xl">{active}</strong>
          </div>
        </article>
        <article className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5">
          <Mail className="text-amber-700" />
          <div>
            <span className="text-xs text-stone-500">Needs attention</span>
            <strong className="block text-2xl">
              {data.filter((s) => s.resendSyncStatus === "FAILED").length}
            </strong>
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
          <span className="sr-only">Search newsletter subscribers</span>
          <input
            className="w-full py-2.5 outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search email…"
          />
        </label>
        <label className="flex">
          <span className="sr-only">Filter subscribers by status</span>
        <select
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>
        </label>
      </div>
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </p>
      ) : (
        <>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Email sync</th>
                <th className="px-5 py-4">Subscribed</th>
                <th className="px-5 py-4">Unsubscribed</th>
                <th className="px-5 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id} className="border-t border-stone-100">
                  <td data-label="Email" className="px-5 py-4 font-medium">{s.email}</td>
                  <td data-label="Status" className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${s.status === "ACTIVE" ? "bg-green-50 text-green-800" : "bg-stone-100 text-stone-600"}`}
                    >
                      {s.status.toLowerCase()}
                    </span>
                  </td>
                  <td data-label="Source" className="px-5 py-4 text-stone-600">
                    {s.source || "website"}
                  </td>
                  <td data-label="Email sync" className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        s.resendSyncStatus === "SYNCED"
                          ? "bg-green-50 text-green-800"
                          : s.resendSyncStatus === "FAILED"
                            ? "bg-red-50 text-red-800"
                            : "bg-amber-50 text-amber-800"
                      }`}
                      title={s.resendSyncError || undefined}
                    >
                      {s.resendSyncStatus.toLowerCase()}
                    </span>
                  </td>
                  <td data-label="Subscribed" className="px-5 py-4">
                    {date.format(new Date(s.subscribedAt))}
                  </td>
                  <td data-label="Unsubscribed" className="px-5 py-4">
                    {s.unsubscribedAt
                      ? date.format(new Date(s.unsubscribedAt))
                      : "—"}
                  </td>
                  <td data-label="Action" className="px-5 py-4 text-right">
                    {s.resendSyncStatus !== "SYNCED" && (
                      <button
                        type="button"
                        onClick={() => void retrySubscriber(s.id)}
                        disabled={retrying === s.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                      >
                        <RefreshCw
                          size={14}
                          className={retrying === s.id ? "animate-spin" : ""}
                        />
                        Retry
                      </button>
                    )}
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
          {!loading && data.length > PAGE_SIZE && (
            <nav aria-label="Subscriber pages" className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-sm">
              <button type="button" aria-label="Previous subscriber page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex min-h-10 items-center gap-1 rounded border border-stone-300 px-3 disabled:opacity-40"><ChevronLeft size={16} />Previous</button>
              <span>Page {currentPage} of {pageCount}</span>
              <button type="button" aria-label="Next subscriber page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="inline-flex min-h-10 items-center gap-1 rounded border border-stone-300 px-3 disabled:opacity-40">Next<ChevronRight size={16} /></button>
            </nav>
          )}
        </div>
        <style jsx>{`
          @media (max-width: 700px) {
            table, tbody { display: block; }
            thead { display: none; }
            tbody { padding: 12px; }
            tbody tr { display: block; margin-bottom: 12px; overflow: hidden; border: 1px solid #e7ddd6; border-radius: 10px; background: white; }
            tbody td { display: flex; align-items: center; justify-content: space-between; gap: 18px; border-top: 1px solid #f1ece8; padding: 11px 14px; text-align: right; overflow-wrap: anywhere; }
            tbody td:first-child { border-top: 0; padding-block: 15px; }
            tbody td::before { content: attr(data-label); flex: 0 0 auto; color: #817a83; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; text-align: left; }
          }
        `}</style>
        </>
      )}
    </section>
  );
}
