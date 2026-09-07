import type { Event } from "@/types/event";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function getUpcomingEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/api/v1/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch upcoming events: ${response.status}`
    );
  }

  return response.json();
}

export async function getHomepageEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/api/v1/events/homepage`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch homepage events: ${response.status}`
    );
  }

  return response.json();
}

export async function getEventBySlug(
  slug: string
): Promise<Event | null> {
  const response = await fetch(
    `${API_URL}/api/v1/events/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch event: ${response.status}`
    );
  }

  return response.json();
}
