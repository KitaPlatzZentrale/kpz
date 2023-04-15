import axios from "axios";
import logger from "../services/logger";
import { Kita } from "../types";

/**
 * Finds nearby kita centers based on latitude and longitude
 * @param {number} lat - The latitude coordinate
 * @param {number} lon - The longitude coordinate
 * @returns {Kita[]} - A list of kita centers in JSON format
 */
export async function getKitaList(req: any, res: any) {
  try {
    let kitas = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&lat=${req.params.lat}&lon=${req.params.lon}&seite=0&max=4000`
    );
    const facilities = transformExternalKitaListToKitaList(kitas);
    logger.info(`Retrieved ${facilities.length} kitas.`);
    return res.status(200).send(facilities);
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

function transformExternalKitaListToKitaList(kitas: any) {
  const facilities = kitas.data.einrichtungen.map((facility: any) => {
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
      availability: Object.keys(availability).length > 0 ? availability : {},
      imageUrl: "https://kita-navigator.berlin.de" + facility.vorschaubild.url,
    };
    return facilityObj;
  });
  return facilities;
}
