type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type Kita = {
  uuid: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
  };
  availability: {
    [key: string]: boolean; // "2023-01-01": true
  };
  capacity: {
    total: number;
    underThree: number;
  };
  minimumAcceptanceAgeInMonths: number;
  contactDetails: {
    email?: string;
    phone?: string;
    website?: string;
  };
  imageUrl: string;
  openingHours: Record<
    Weekday,
    {
      from: string;
      to: string;
    }
  >;
  approach: {
    pedagogicalConcepts: string[];
    emphasis: string[];
    multilangual: boolean;
    languages?: string[];
    mixedAges: boolean;
    mixedAgesDescriptions?: string[];
  };
  foundingDate: string;
  closingDate?: string;
};
