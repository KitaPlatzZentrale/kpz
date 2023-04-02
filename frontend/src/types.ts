type Kita = {
  uuid: string;
  name: string;
  number: string;
  coordinates: {
    lat: number;
    lng: number;
    dist: number;
  };
  address: {
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
  };
  availability: {
    [key: string]: boolean;
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

export type { Kita, KitaDetail };