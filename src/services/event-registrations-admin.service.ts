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
  checkedInAt: string | null;
  ticketToken: string;
  confirmationEmailSentAt: string | null;
  confirmationEmailError: string | null;
};

export type AdminEventRegistrationsResponse = {
  summary: { paidRegistrations: number; ticketsSold: number; revenue: number; checkedInTickets: number };
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

export type TicketCheckIn = {
  status: "VALID" | "CHECKED_IN" | "ALREADY_CHECKED_IN";
  confirmationNumber: string;
  fullName: string;
  email: string;
  guestCount: number;
  eventTitle: string;
  eventSlug: string;
  checkedInAt: string | null;
};

async function ticketRequest(path: string, ticketToken: string, method = "POST") {
  const response = await fetch(`/api/admin/event-registrations/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketToken }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.message || "Unable to validate this ticket.");
  return data as TicketCheckIn;
}

export const validateTicket = (ticketToken: string) => ticketRequest("check-in/validate", ticketToken);
export const checkInTicket = (ticketToken: string) => ticketRequest("check-in", ticketToken);
export const undoTicketCheckIn = (ticketToken: string) => ticketRequest("check-in", ticketToken, "DELETE");

export async function sendRegistrationConfirmationEmail(registrationId: string) {
  const response = await fetch(`/api/admin/event-registrations/${encodeURIComponent(registrationId)}/confirmation-email`, { method: "POST" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.message || "Unable to send confirmation email.");
  return data as AdminEventRegistration;
}
