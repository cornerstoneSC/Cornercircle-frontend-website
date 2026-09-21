export default function PublicLoading() {
  return (
    <main
      className="grid min-h-[60vh] place-items-center bg-[#f8f5ef] px-5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="text-center text-[#625b64]">
        <span className="mx-auto block h-10 w-10 animate-pulse rounded-full border border-[#b88935] bg-[#f4ead7]" />
        <p className="mt-4 text-sm">Loading Cornerstone Social Circle…</p>
      </div>
    </main>
  );
}
