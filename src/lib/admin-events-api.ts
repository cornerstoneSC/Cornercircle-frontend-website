import type {
  AdminEvent,
  EventPublicationStatus,
  EventVisibility,
} from "@/types/admin-event";
import { prepareImageUpload } from "@/lib/prepare-image-upload";

const API_URL = "/api/admin/events";

export interface EventExpectationPayload {
  title: string;
  description: string;
}

export interface EventRequestPayload {
  title: string;
  category: string;

  shortDescription: string;
  description: string;
  coverImageUrl: string;

  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  timeZone: string;

  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  expectations: EventExpectationPayload[];

  additionalInformation: string;

  pricePerPerson: number | null;
  capacity: number | null;
  registrationDeadline: string | null;

  publicationStatus: EventPublicationStatus;
  visibility: EventVisibility;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");

    let message = text;

    try {
      const body = JSON.parse(text);
      message = body.message || body.error || text;
    } catch {
      // Use raw text if it is not JSON
    }

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export interface EventImageUploadResponse {
  url: string;
  publicId: string;
}

export async function uploadEventImage(
  file: File,
): Promise<EventImageUploadResponse> {
  const formData = new FormData();

  formData.append("file", await prepareImageUpload(file));

  const response = await fetch(`${API_URL}/image`, {
    method: "POST",

    credentials: "include",

    body: formData,
  });

  return handleResponse<EventImageUploadResponse>(response);
}

export async function getAllAdminEvents(): Promise<AdminEvent[]> {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  return handleResponse<AdminEvent[]>(response);
}

export async function getUpcomingAdminEvents(): Promise<AdminEvent[]> {
  const response = await fetch(`${API_URL}/upcoming`, {
    credentials: "include",
  });

  return handleResponse<AdminEvent[]>(response);
}

export async function getPastAdminEvents(): Promise<AdminEvent[]> {
  const response = await fetch(`${API_URL}/past`, {
    credentials: "include",
  });

  return handleResponse<AdminEvent[]>(response);
}

export async function getDraftAdminEvents(): Promise<AdminEvent[]> {
  const response = await fetch(`${API_URL}/drafts`, {
    credentials: "include",
  });

  return handleResponse<AdminEvent[]>(response);
}

export async function updateEventVisibility(
  id: number,
  visibility: EventVisibility,
): Promise<AdminEvent> {
  const response = await fetch(`${API_URL}/${id}/visibility`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      visibility,
    }),
  });

  return handleResponse<AdminEvent>(response);
}

export async function createAdminEvent(
  payload: EventRequestPayload,
): Promise<AdminEvent> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminEvent>(response);
}

export async function updateAdminEvent(
  id: number,
  payload: EventRequestPayload,
): Promise<AdminEvent> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminEvent>(response);
}

export async function getAdminEvent(id: number): Promise<AdminEvent> {
  const response = await fetch(`${API_URL}/${id}`, {
    credentials: "include",
  });

  return handleResponse<AdminEvent>(response);
}

export async function publishEvent(id: number): Promise<AdminEvent> {
  const response = await fetch(`${API_URL}/${id}/publish`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse<AdminEvent>(response);
}

export async function unpublishEvent(id: number): Promise<AdminEvent> {
  const response = await fetch(`${API_URL}/${id}/unpublish`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse<AdminEvent>(response);
}

export async function deleteEvent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");

    throw new Error(message || `Failed to delete event: ${response.status}`);
  }
}
