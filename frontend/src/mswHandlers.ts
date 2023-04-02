// API Mocking until API is ready

import { Kita, KitaDetail } from "./types";

export function generateKitasAndDetails(count: number): {
  kitas: Kita[];
  kitaDetails: { [uuid: string]: KitaDetail };
} {
  const kitas: Kita[] = [];
  const kitaDetails: { [uuid: string]: KitaDetail } = {};

  for (let i = 0; i < count; i++) {
    const uuid = `kita-${i + 1}`;
    const kita: Kita = {
      uuid,
      name: `Kita ${i + 1}`,
      number: `${1000 + i}`,
      coordinates: {
        lat: 52.52 + i * 0.01,
        lng: 13.4 + i * 0.01,
        dist: 0.5,
      },
      address: {
        street: `Kita Street ${i + 1}`,
        houseNumber: `${42 + i}`,
        zip: `1234${i}`,
        city: "Berlin",
      },
      availability: {
        "2023-01-01": true,
      },
      imageUrl: "https://placekitten.com/200/300?image=" + (i + 1),
    };

    const kitaDetail: KitaDetail = {
      ...kita,
      capacity: {
        total: 30 + i,
        underThree: 10 + i,
      },
      minimumAcceptanceAgeInMonths: 3,
      contactDetails: {
        email: `kita${i + 1}@example.com`,
        phone: `+49 30 12345${i}`,
        website: `https://kita${i + 1}.example.com`,
      },
      openingHours: {
        monday: {
          from: "08:00",
          to: "17:00",
        },
        tuesday: {
          from: "08:00",
          to: "17:00",
        },
      },
      approach: {
        pedagogicalConcepts: ["Montessori", "Waldorf"],
        emphasis: ["Inclusion", "Sustainability"],
        languages: ["German", "English"],
        mixedAgesDescriptions: ["Mixed age groups"],
      },
      foundingDate: "2022-01-01",
      closingDate: undefined,
    };

    kitas.push(kita);
    kitaDetails[uuid] = kitaDetail;
  }

  return { kitas, kitaDetails };
}
