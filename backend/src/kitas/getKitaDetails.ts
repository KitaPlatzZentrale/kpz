import axios from "axios";
import logger from "../services/logger";
import { KitaDetail } from "../types";

/**
 * Returns details for a specific kita center
 * @param {string} uuid - The uuid of the kita center
 * @returns {KitaDetail} - The details of the kita center in JSON format
 */
export async function getKitaDetailsExternal(req: any, res: any) {
  try {
    let kita = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${req.params.uuid}`
    );
    logger.info(`Retrieved details for Kita with uuid ${req.params.uuid}.`);
    const facilityObj = transformExternalKitaDetailsToKitaDetails(kita.data);
    return res.status(200).send(facilityObj);
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export function transformExternalKitaDetailsToKitaDetails(facility: any) {
  const availability: { [key: string]: boolean } = {};
  facility.einrichtungsauszug.freiplatzstatus.forEach((status: any) => {
    availability[status.gueltigAb] = status.plaetzeVerfuegbar;
  });
  const openingHours = transformOpeningHours(facility);

  const facilityObj: KitaDetail = {
    uuid: facility.einrichtungsauszug.id.toString(),
    name: facility.einrichtungsauszug.name,
    number: facility.einrichtungsauszug.nummer,
    coordinates: {
      lat: facility.einrichtungsauszug.geokoordinate.lat,
      lng: facility.einrichtungsauszug.geokoordinate.lon,
      dist: facility.einrichtungsauszug.geokoordinate.entfernung,
    },
    address: {
      street: facility.einrichtungsauszug.adresse.strasse,
      houseNumber: facility.einrichtungsauszug.adresse.hausnummer,
      zip: facility.einrichtungsauszug.adresse.plz,
      city: facility.einrichtungsauszug.adresse.ort,
    },
    availability,
    imageUrl:
      "https://kita-navigator.berlin.de" +
      facility.einrichtungsauszug.vorschaubild.url,
    capacity: {
      total: facility.betreuung.anzahlKinder,
      underThree: facility.betreuung.anzahlKinderUnter3,
    },
    minimumAcceptanceAgeInMonths: facility.betreuung.aufnahmealter * 12,
    contactDetails: {
      email: facility.kontaktdaten.emailadresse,
      phone: facility.kontaktdaten.telefonnummer,
      website: facility.kontaktdaten.webadresse,
    },
    openingHours: openingHours,
    approach: {
      pedagogicalConcepts: facility.betreuung.paedagogischerAnsatz,
      emphasis: facility.betreuung.thematischeSchwerpunkte,
      languages: facility.betreuung.mehrsprachigkeit,
      mixedAgesDescriptions: facility.betreuung.altersmischung,
    },
    foundingDate: facility.oeffnungsdatum,
    closingDate: facility.schliessdatum,
  };
  return facilityObj;
}

function transformOpeningHours(facility: any) {
  const openingHours: any = {};
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  for (let i = 0; i < 5; i++) {
    const dayOfWeek = daysOfWeek[i];

    if (
      facility.oeffnungszeiten[i] &&
      facility.oeffnungszeiten[i].von &&
      facility.oeffnungszeiten[i].bis
    ) {
      openingHours[dayOfWeek] = {
        from: facility.oeffnungszeiten[i].von,
        to: facility.oeffnungszeiten[i].bis,
      };
    } else {
      openingHours[dayOfWeek] = {
        from: null,
        to: null,
      };
    }
  }
  return openingHours;
}
