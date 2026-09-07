export interface EventExpectation {
  title: string;
  description: string;
}

export interface Event {
  id: number;

  title: string;
  slug: string;
  category: string;

  shortDescription: string;
  description: string;
  coverImageUrl: string;

  eventDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;

  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;

  expectations: EventExpectation[];

  additionalInformation: string | null;

  pricePerPerson: number;
  capacity: number;

  registrationDeadline: string | null;
  registrationOpen: boolean;
}
