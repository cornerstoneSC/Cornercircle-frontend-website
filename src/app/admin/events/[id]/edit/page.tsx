import { notFound } from "next/navigation";

import EventForm from "@/components/admin/events/EventForm";
import { getAdminEventServer } from "@/lib/admin-events-server";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound();
  }

  const event = await getAdminEventServer(eventId).catch(() => null);

  if (!event) {
    notFound();
  }

  return <EventForm initialEvent={event} />;
}
