import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ef] px-5 py-20 text-center text-[#2b1d35]">
      <section className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#a77925]">404 · Cornerstone Social Circle</p>
        <h1 className="mt-5 font-serif text-5xl sm:text-6xl">This page isn&apos;t here.</h1>
        <p className="mt-4 leading-7 text-[#625b64]">The link may have changed, or the page may no longer be available.</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center bg-[#2b1d35] px-7 font-semibold text-white">Return home</Link>
      </section>
    </main>
  );
}
