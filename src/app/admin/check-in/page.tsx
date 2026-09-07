import CheckInClient from "@/components/admin/registrations/CheckInClient";

export default async function CheckInPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  const { ticket = "" } = await searchParams;
  return <CheckInClient initialTicket={ticket} />;
}
