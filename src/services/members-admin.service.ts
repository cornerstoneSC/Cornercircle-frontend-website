export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED" | "EXPIRED";

export type AdminMember = {
  applicationId: string;
  fullName: string;
  email: string;
  phone: string | null;
  city: string;
  birthday: string | null;
  paymentStatus: PaymentStatus;
  amountCents: number;
  paidAt: string | null;
  membershipStartsOn: string | null;
  membershipEndsOn: string | null;
  renewalReminderSentAt: string | null;
  activities: string[];
  goals: string[];
  membershipAgreementAccepted: boolean;
  photographyNoticeAcknowledged: boolean;
  inspiredBy: string;
  comments: string | null;
  internalNotes: string | null;
  stripeCheckoutSessionId: string | null;
  joinedAt: string;
};

export type AdminMembersResponse = {
  summary: { totalMembers: number; paid: number; paymentPending: number };
  members: AdminMember[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/members${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401) throw new Error("Your admin session has expired. Sign in again.");
  if (response.status === 503) throw new Error("The member service is temporarily unavailable.");
  if (response.status === 404) throw new Error("The member could not be found, or the updated backend needs to be restarted.");
  if (!response.ok) throw new Error(`Unable to load members (${response.status}).`);
  return response.json();
}

export function getAdminMembers(query = "") {
  return request<AdminMembersResponse>(`?query=${encodeURIComponent(query)}`);
}

export function recordRenewalReminder(applicationId: string) {
  return request<AdminMember>(`/${encodeURIComponent(applicationId)}/renewal-reminder`, { method: "POST" });
}

export function saveMemberNotes(applicationId: string, internalNotes: string) {
  return request<AdminMember>(`/${encodeURIComponent(applicationId)}/notes`, {
    method: "PATCH",
    body: JSON.stringify({ internalNotes }),
  });
}
