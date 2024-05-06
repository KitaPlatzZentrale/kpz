export interface IPaginatedKitasParams {
  lat: string;
  lng: string;
  radius: string;
  page?: string;
  limit?: string;
}

export type Kita = {
  id?: number;
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
    [key: string]: boolean; // "2023-01-01": true
  };
  imageUrl: string;
};
