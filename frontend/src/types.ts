type Kita = {
  uuid: string;
  name: string;
  number: string;
  location: {
    type: "Point";
    coordinates: [number, number];
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

export type PaginatedResultsMetadata = {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  amountOfItems: number;
  nextPage: number | false;
};

export interface PaginatedResultsResponse<T> {
  meta: PaginatedResultsMetadata;
  items: T[];
}

export type { Kita, KitaDetail };
