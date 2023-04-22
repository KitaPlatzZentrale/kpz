import axios from "axios";
import logger from "../../logger";
import BerlinDEKitaModel, {
  BerlinDEKitaDetailedEntity,
  BerlinDEKitaSummaryEntity,
} from "../../models/external/BerlinDEKita";
import { Kita, KitaDetail } from "../../types";

class BerlinDEService {
  /**
   * Returns details for a specific kita center
   * @param {string} uuid - The uuid of the kita center
   * @returns {KitaDetail | void} - The details of the kita center in JSON format
   */
  public static getKitaDetails = async (
    uuid: string
  ): Promise<KitaDetail | void> => {
    let kita = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${uuid}`
    );

    logger.info(`Retrieved details for Kita with uuid ${uuid}.`);

    const kitaSummaryObj = this.transformBerlinDEKitaDetailedEntityToKitaDetail(
      kita.data
    );

    return kitaSummaryObj;
  };

  /**
   * Finds nearby kita centers based on latitude and longitude
   * @param {number} lat - The latitude coordinate
   * @param {number} lon - The longitude coordinate
   * @returns {Promise<Kita[]>} - A list of kita centers in JSON format
   */
  public static getKitasAtLocation = async (
    lat: number,
    lon: number
  ): Promise<Kita[]> => {
    const kitaSummaries = await BerlinDEKitaModel.findManyAtLocation(lat, lon);

    const transformedToKitas = kitaSummaries.map((kitaSummary) =>
      this.transformBerlinDEKitaSummaryEntityToKita(kitaSummary)
    );

    logger.info(
      `Retrieved ${transformedToKitas.length} Kitas at position [Lat ${lat}, Lng ${lon}].`
    );

    return transformedToKitas;
  };

  private static transformBerlinDEKitaSummaryEntityToKita(
    kitaSummary: BerlinDEKitaSummaryEntity
  ): Kita {
    const availability: { [key: string]: boolean } = {};
    kitaSummary.freiplatzstatus.forEach((status: any) => {
      availability[status.gueltigAb] = status.plaetzeVerfuegbar;
    });

    const kitaObj: Kita = {
      uuid: kitaSummary.id.toString(),
      name: kitaSummary.name,
      number: kitaSummary.nummer,
      location: {
        type: "Point",
        coordinates: [
          kitaSummary.geokoordinate.lon, // long has to be first!
          kitaSummary.geokoordinate.lat,
        ],
      },
      address: {
        street: kitaSummary.adresse.strasse,
        houseNumber: kitaSummary.adresse.hausnummer,
        zip: kitaSummary.adresse.plz,
        city: kitaSummary.adresse.ort,
      },
      availability: Object.keys(availability).length > 0 ? availability : {},
      imageUrl:
        "https://kita-navigator.berlin.de" + kitaSummary.vorschaubild.url,
    };
    return kitaObj;
  }

  private static transformBerlinDEKitaDetailedEntityToKitaDetail = (
    kitaDetailed: any
  ): KitaDetail => {
    const availability: { [key: string]: boolean } = {};
    kitaDetailed.einrichtungsauszug.freiplatzstatus.forEach((status: any) => {
      availability[status.gueltigAb] = status.plaetzeVerfuegbar;
    });
    const openingHours = this.transformOpeningHours(kitaDetailed);

    const kitaDetailedObj: KitaDetail = {
      uuid: kitaDetailed.einrichtungsauszug.id.toString(),
      name: kitaDetailed.einrichtungsauszug.name,
      number: kitaDetailed.einrichtungsauszug.nummer,
      location: {
        type: "Point",
        coordinates: [
          kitaDetailed.einrichtungsauszug.geokoordinate.lon, // long has to be first!
          kitaDetailed.einrichtungsauszug.geokoordinate.lat,
        ],
      },
      address: {
        street: kitaDetailed.einrichtungsauszug.adresse.strasse,
        houseNumber: kitaDetailed.einrichtungsauszug.adresse.hausnummer,
        zip: kitaDetailed.einrichtungsauszug.adresse.plz,
        city: kitaDetailed.einrichtungsauszug.adresse.ort,
      },
      availability,
      imageUrl:
        "https://kita-navigator.berlin.de" +
        kitaDetailed.einrichtungsauszug.vorschaubild.url,
      capacity: {
        total: kitaDetailed.betreuung.anzahlKinder,
        underThree: kitaDetailed.betreuung.anzahlKinderUnter3,
      },
      minimumAcceptanceAgeInMonths: kitaDetailed.betreuung.aufnahmealter * 12,
      contactDetails: {
        email: kitaDetailed.kontaktdaten.emailadresse,
        phone: kitaDetailed.kontaktdaten.telefonnummer,
        website: kitaDetailed.kontaktdaten.webadresse,
      },
      openingHours: openingHours,
      approach: {
        pedagogicalConcepts: kitaDetailed.betreuung.paedagogischerAnsatz,
        emphasis: kitaDetailed.betreuung.thematischeSchwerpunkte,
        languages: kitaDetailed.betreuung.mehrsprachigkeit,
        mixedAgesDescriptions: kitaDetailed.betreuung.altersmischung,
      },
      foundingDate: kitaDetailed.oeffnungsdatum,
      closingDate: kitaDetailed.schliessdatum,
    };
    return kitaDetailedObj;
  };

  private static transformOpeningHours = (
    openingHours: BerlinDEKitaDetailedEntity["oeffnungszeiten"]
  ): KitaDetail["openingHours"] => {
    const transformedOpeningHours: any = {};
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (let i = 0; i < 5; i++) {
      const dayOfWeek = daysOfWeek[i];

      if (openingHours[i] && openingHours[i].von && openingHours[i].bis) {
        transformedOpeningHours[dayOfWeek] = {
          from: openingHours[i].von,
          to: openingHours[i].bis,
        };
      } else {
        transformedOpeningHours[dayOfWeek] = {
          from: null,
          to: null,
        };
      }
    }
    return transformedOpeningHours;
  };
}

export default BerlinDEService;
