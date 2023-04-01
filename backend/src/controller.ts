export function translateKitalistJson(input: any): Kita[] {
  const facilities = input.einrichtungen.map((facility: any) => {
    const availability: { [key: string]: boolean } = {};
    facility.freiplatzstatus.forEach((status: any) => {
      availability[status.gueltigAb] = status.plaetzeVerfuegbar;
    });

    const facilityObj: Kita = {
      uuid: facility.id.toString(),
      name: facility.name,
      number: facility.nummer,
      coordinates: {
        lat: facility.geokoordinate.lat,
        lng: facility.geokoordinate.lon,
        dist: facility.geokoordinate.entfernung,
      },
      address: {
        street: facility.adresse.strasse,
        houseNumber: facility.adresse.hausnummer,
        zip: facility.adresse.plz,
        city: facility.adresse.ort,
      },
      availability,
      imageUrl: 'https://kita-navigator.berlin.de' + facility.vorschaubild.url,
    };

    return facilityObj;
  });

  return facilities;
}

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
    [key: string]: boolean; // "2023-01-01": true
  };
  imageUrl: string;
};
