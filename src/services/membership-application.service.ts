export type MembershipApplicationPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  birthday: string | null;
  inspiredBy: string;
  activities: string[];
  goals: string[];
  membershipAgreementAccepted: boolean;
  photographyNoticeAcknowledged: boolean;
  comments: string;
};

export type MembershipState = "PENDING_PAYMENT" | "ACTIVE" | "PAST_DUE" | "PAYMENT_FAILED" | "CANCELLED" | "REFUNDED" | "EXPIRED";

export class MembershipRequestError extends Error {
  constructor(message: string, readonly fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "MembershipRequestError";
  }
}

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit, notFoundMessage = "This membership application could not be found."): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${api}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new Error("We couldn’t connect to secure checkout. Please try again in a moment.");
  }
  if (!response.ok) {
    let body: { message?: string; detail?: string; error?: string; fieldErrors?: Record<string, string> } = {};
    try { body = await response.json(); } catch { /* Use the safe status-specific fallback below. */ }
    const serverMessage = body.message || body.detail;
    if (response.status === 400) throw new MembershipRequestError(serverMessage || "Please review the membership form and complete all required fields.", body.fieldErrors);
    if (response.status === 404) throw new Error(notFoundMessage);
    if (response.status === 409) throw new Error(serverMessage || "This membership has already been processed.");
    if (response.status === 503) throw new Error("Secure checkout is temporarily unavailable. Please try again shortly.");
    throw new Error("We couldn’t start secure checkout. Your card has not been charged.");
  }
  return response.json();
}

export async function submitMembershipApplication(payload: MembershipApplicationPayload) {
  return request<{ applicationId: string; status: MembershipState }>("/api/v1/membership-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  }, "The membership application service is not available. Restart the updated backend and try again.");
}

export async function createMembershipCheckout(applicationId: string) {
  return request<{ checkoutUrl: string }>(`/api/v1/membership-applications/${encodeURIComponent(applicationId)}/checkout-session`, { method: "POST" });
}

export async function getMembershipStatus(applicationId: string) {
  return request<{ applicationId: string; status: MembershipState; paymentComplete: boolean }>(`/api/v1/membership-applications/${encodeURIComponent(applicationId)}/status`);
}

export async function createMembershipRenewalCheckout(applicationId: string) {
  return request<{ checkoutUrl: string }>(`/api/v1/membership-applications/${encodeURIComponent(applicationId)}/renewal-checkout-session`, { method: "POST" });
}
