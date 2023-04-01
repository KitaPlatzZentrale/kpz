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

export function kitaDetail(input: any): KitaDetail {
  const facility = input

  const availability: { [key: string]: boolean } = {};
  input.einrichtungsauszug.freiplatzstatus.forEach((status: any) => {
    availability[status.gueltigAb] = status.plaetzeVerfuegbar;
  });

  console.log("LOG: " + input.oeffnungszeiten)
  console.log("LOG: " + input.oeffnungszeiten[0])
  console.log("LOG: " + input.oeffnungszeiten[0].von)

  const facilityObj: KitaDetail = {
    uuid: input.einrichtungsauszug.id.toString(),
    name: input.einrichtungsauszug.name,
    number: input.einrichtungsauszug.nummer,
    coordinates: {
      lat: input.einrichtungsauszug.geokoordinate.lat,
      lng: input.einrichtungsauszug.geokoordinate.lon,
      dist: input.einrichtungsauszug.geokoordinate.entfernung,
    },
    address: {
      street: input.einrichtungsauszug.adresse.strasse,
      houseNumber: input.einrichtungsauszug.adresse.hausnummer,
      zip: input.einrichtungsauszug.adresse.plz,
      city: input.einrichtungsauszug.adresse.ort,
    },
    availability,
    imageUrl: 'https://kita-navigator.berlin.de' + input.einrichtungsauszug.vorschaubild.url,
    capacity: {
      "total": input.betreuung.anzahlKinder,
      "underThree": input.betreuung.anzahlKinderUnter3
    },
    minimumAcceptanceAgeInMonths: input.betreuung.aufnahmealter * 12,
    contactDetails: {
      email: input.kontaktdaten.emailadresse,
      phone: input.kontaktdaten.telefonnummer,
      website: input.kontaktdaten.webadresse
    },
    openingHours: {
      "monday": {
        from: input.oeffnungszeiten[0].von,
        to: input.oeffnungszeiten[0].bis
      },
      "tuesday": {
        from: input.oeffnungszeiten[1].von,
        to: input.oeffnungszeiten[1].bis
      },
      "wednesday": {
        from: input.oeffnungszeiten[2].von,
        to: input.oeffnungszeiten[2].bis
      },
      "thursday": {
        from: input.oeffnungszeiten[3].von,
        to: input.oeffnungszeiten[3].bis
      },
      "friday": {
        from: input.oeffnungszeiten[4].von,
        to: input.oeffnungszeiten[4].bis
      }
    },
    approach: {
      pedagogicalConcepts: facility.betreuung.paedagogischerAnsatz,
      emphasis: facility.betreuung.thematischeSchwerpunkte,
      languages: facility.betreuung.mehrsprachigkeit,
      mixedAgesDescriptions: facility.betreuung.altersmischung
    },
    foundingDate: facility.oeffnungsdatum,
    closingDate: facility.schliessdatum
  }
  return facilityObj;
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
      to: string
    }
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