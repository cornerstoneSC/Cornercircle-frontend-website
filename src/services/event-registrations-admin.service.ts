export type AdminEventRegistration = {
  registrationId: string;
  fullName: string;
  email: string;
  phone: string;
  eventTitle: string;
  eventSlug: string;
  ticketQuantity: number;
  amountPaid: number;
  paymentStatus: "PAID";
  registrationDate: string;
  confirmationNumber: string;
};

export type AdminEventRegistrationsResponse = {
  summary: { paidRegistrations: number; ticketsSold: number; revenue: number };
  registrations: AdminEventRegistration[];
};

export async function getEventRegistrations(query = "", event = "") {
  const params = new URLSearchParams({ query, event });
  const response = await fetch(`/api/admin/event-registrations?${params}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (response.status === 401) throw new Error("Your admin session has expired. Sign in again.");
  if (response.status === 503) throw new Error("The registrations service is temporarily unavailable.");
  if (!response.ok) throw new Error(`Unable to load registrations (${response.status}).`);
  return response.json() as Promise<AdminEventRegistrationsResponse>;
}
