import type { EventExpectation } from "@/types/event";

export type EventPublicationStatus = "DRAFT" | "PUBLISHED";

export type EventVisibility = "PUBLIC" | "HIDDEN";

export interface AdminEvent {
  id: number;

  title: string;
  slug: string;
  category: string | null;

  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;

  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  timeZone: string;

  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;

  expectations: EventExpectation[];

  additionalInformation: string | null;

  pricePerPerson: number | null;
  capacity: number | null;
  remainingCapacity: number | null;
  registrationDeadline: string | null;

  publicationStatus: EventPublicationStatus;
  visibility: EventVisibility;

  createdAt: string;
  updatedAt: string;
}
