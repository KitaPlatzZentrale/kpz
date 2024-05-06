import axios from "axios";
import BerlinDEKitaModel, {
  BerlinDEKitaDetailedEntity,
  BerlinDEKitaSummaryEntity,
} from "./model";
import { Kita, KitaDetail } from "../types";

const KITA_API_URL = process.env.KITA_API_URL;
if (!KITA_API_URL) throw new Error("No KITA_API_URL found in .env");

class BerlinDEService {
  public static getKitaList = async (): Promise<Kita[]> => {
    try {
      let kitaList = await axios.get(
        `${KITA_API_URL}/umkreissuche?entfernung=50&seite=0&max=5000`
      );
      return kitaList.data.einrichtungen;
    } catch (error) {
      console.error("Error in getKitaList:", error);
      throw error;
    }
  };

  public static getAllKitaUUIDs = async (
    kitaList: Kita[]
  ): Promise<number[]> => {
    try {
      const idsSet = new Set<number>();
      kitaList.forEach((kita: Kita) => {
        idsSet.add(kita.id);
      });

      const idsArray: number[] = Array.from(idsSet);
      return idsArray;
    } catch (error) {
      console.error("Error in getAllKitaUUIDs:", error);
      throw error;
    }
  };

  public static getKitaDetails = async (
    uuid: number
  ): Promise<KitaDetail | null> => {
    try {
      let response = await axios.get(`${KITA_API_URL}/${uuid}`);

      if (!response.data) {
        return null;
      }

      const kitaDetails =
        KitaTransformer.transformBerlinDEKitaDetailedEntityToKitaDetail(
          response.data
        );

      return kitaDetails;
    } catch (error) {
      console.error(`Error in getKitaDetails for uuid ${uuid}:`, error);
      throw error;
    }
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
      KitaTransformer.transformBerlinDEKitaSummaryEntityToKita(kitaSummary)
    );

    console.info(
      `Retrieved ${transformedToKitas.length} Kitas at position [Lat ${lat}, Lng ${lon}].`
    );

    return transformedToKitas;
  };
}

class KitaTransformer {
  public static transformBerlinDEKitaSummaryEntityToKita(
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

  public static transformBerlinDEKitaDetailedEntityToKitaDetail = (
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
