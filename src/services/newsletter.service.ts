export type NewsletterSubscribeStatus =
  | "NEW_SUBSCRIBER"
  | "ALREADY_SUBSCRIBED"
  | "REACTIVATED";

export type NewsletterSubscriber = {
  id: number;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  source: string | null;
  resendSyncStatus: "PENDING" | "SYNCED" | "FAILED";
  resendSyncError: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  welcomeEmailSentAt: string | null;
};

export async function subscribeNewsletter(
  email: string,
  website = "",
  source = "website",
) {
  const response = await fetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, website, source }),
  });
  const body = (await response.json().catch(() => null)) as
    | { message?: string; status?: NewsletterSubscribeStatus }
    | null;
  if (!response.ok)
    throw new Error(body?.message || "Unable to subscribe right now.");
  return (body?.status || "NEW_SUBSCRIBER") as NewsletterSubscribeStatus;
}

export async function getNewsletterSubscribers(query = "", status = "") {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (status) params.set("status", status);
  const response = await fetch(`/api/admin/newsletter?${params}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || "Unable to load subscribers.");
  }
  return response.json() as Promise<NewsletterSubscriber[]>;
}


export async function retryNewsletterSubscriber(id: number) {
  const response = await fetch(`/api/admin/newsletter/${id}/retry`, {
    method: "POST",
  });
  const body = (await response.json().catch(() => null)) as
    | NewsletterSubscriber
    | { message?: string }
    | null;
  if (!response.ok)
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : "Unable to retry synchronization.",
    );
  return body as NewsletterSubscriber;
}
