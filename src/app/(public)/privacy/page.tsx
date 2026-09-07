import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cornerstone Social Circle",
  description: "How Cornerstone Social Circle handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-stone-800 md:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9c7127]">Cornerstone Social Circle</p>
      <h1 className="mt-5 font-serif text-5xl text-[#332033]">Privacy Policy</h1>
      <p className="mt-5 text-stone-600">Last updated September 7, 2026</p>
      <div className="mt-12 space-y-9 leading-7">
        <section><h2 className="font-serif text-3xl text-[#332033]">Information we collect</h2><p className="mt-3">We collect information you choose to provide when you contact us, subscribe to updates, apply for membership, or register for an event. This may include your name, email address, telephone number, and registration details.</p></section>
        <section><h2 className="font-serif text-3xl text-[#332033]">How we use information</h2><p className="mt-3">We use this information to respond to requests, administer memberships and events, process payments, provide requested services, and send updates you have requested.</p></section>
        <section><h2 className="font-serif text-3xl text-[#332033]">Service providers</h2><p className="mt-3">We may use trusted providers to host this website, store information, deliver media, and process payments. They receive information only as needed to provide those services.</p></section>
        <section><h2 className="font-serif text-3xl text-[#332033]">Your choices</h2><p className="mt-3">You may unsubscribe from newsletter messages using the link included in each message. You may also contact us to ask about the personal information associated with your submissions.</p></section>
        <section><h2 className="font-serif text-3xl text-[#332033]">Contact</h2><p className="mt-3">For privacy questions or requests, please use the contact page on this website.</p></section>
      </div>
    </main>
  );
}
