import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events-api";
import RegistrationConfirmation from "@/components/events/RegistrationConfirmation";

export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ registration_id?: string }>;
}) {
  const { slug } = await params;
  const { registration_id: registrationId } = await searchParams;
  if (!registrationId || !/^[0-9a-f-]{36}$/i.test(registrationId)) notFound();
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const eventDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${event.eventDate}T00:00:00`));
  return (
    <RegistrationConfirmation
      slug={slug}
      registrationId={registrationId}
      eventTitle={event.title}
      eventDate={eventDate}
    />
  );
}
