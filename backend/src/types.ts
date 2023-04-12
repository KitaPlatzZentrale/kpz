interface KitaResponse {
  anzahl: number;
  einrichtungen: Array<{
    name: string;
    adresse: {
      plz: string;
      ort: string;
    };
  }>;
}

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
  number: string;
  coordinates: {
    lat: number;
    lng: number;
    dist: number | null;
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
  imageUrl: string;
};

interface KitaDetail extends Kita {
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
  openingHours: {
    [key: string]: {
      from: string;
      to: string;
    };
  };
  approach: {
    pedagogicalConcepts: string[];
    emphasis: string[];
    languages?: string[];
    mixedAgesDescriptions?: string[];
  };
  foundingDate: string;
  closingDate?: string;
}

export { Kita, KitaDetail, KitaResponse, Weekday };