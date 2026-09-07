import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events-api";
import EventRegistrationCheckout from "@/components/events/EventRegistrationCheckout";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || !event.registrationOpen) notFound();
  return <EventRegistrationCheckout event={event} />;
}
