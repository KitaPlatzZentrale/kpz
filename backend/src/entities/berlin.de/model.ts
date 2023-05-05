import axios from "axios";

type GeoCoordinates = {
  lon: number;
  lat: number;
  entfernung: number;
};

type PreviewImage = {
  url: string;
};

type Address = {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
};

type FreeSlotsAvailability = {
  gueltigAb: string;
  plaetzeVerfuegbar: boolean;
};

type ContactDetails = {
  emailadresse: string;
  telefonnummer: string;
  webadresse: string;
};

type Childcare = {
  aufnahmealter: number;
  anzahlKinder: number;
  anzahlKinderUnter3: number;
  paedagogischerAnsatz: string[];
  thematischeSchwerpunkte: string[];
  mehrsprachigkeit: string[];
  altersmischung: string[];
};

type OpeningHours = {
  tag: string;
  von: string;
  bis: string;
};

export type BerlinDEKitaSummaryEntity = {
  id: number;
  name: string;
  nummer: string;
  geokoordinate: GeoCoordinates;
  vorschaubild: PreviewImage;
  adresse: Address;
  freiplatzstatus: FreeSlotsAvailability[];
};

export type BerlinDEKitaDetailedEntity = {
  einrichtungsauszug: BerlinDEKitaSummaryEntity;
  kontaktdaten: ContactDetails;
  betreuung: Childcare;
  bild: PreviewImage;
  oeffnungszeiten: OpeningHours[];
  oeffnungsdatum: string;
  schliessdatum: string | null;
};

type BerlinDEKitaFindResponse = BerlinDEKitaDetailedEntity;

type BerlinDEKitaFindManyAtLocationResponse = {
  metainformation: {
    anzahlSeiten: number;
    seite: number;
    anzahlErgebnisse: number;
  };
  einrichtungen: BerlinDEKitaSummaryEntity[];
};

class BerlinDEKitaModel {
  public static find = async (
    uuid: string
  ): Promise<BerlinDEKitaDetailedEntity> => {
    const response = await axios.get<BerlinDEKitaFindResponse>(
      `https://kita-navigator.berlin.de/api/v1/kitas/${uuid}`
    );

    if (!response.data)
      throw new Error(
        `Request to berlin.de for Kita with uuid ${uuid} failed.`
      );

    const { data } = response;

    return data;
  };

  public static findManyAtLocation = async (
    latitude: number,
    longitude: number
  ): Promise<BerlinDEKitaSummaryEntity[]> => {
    const response = await axios.get<BerlinDEKitaFindManyAtLocationResponse>(
      `https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&lat=${latitude}&lon=${longitude}&seite=0&max=4000`
    );

    if (!response.data)
      throw new Error(
        `Request to berlin.de for Kitas at position [Lat ${latitude}, Lng ${longitude}] failed.`
      );

    const { data } = response;
    const { einrichtungen } = data;

    return einrichtungen;
  };
}

export default BerlinDEKitaModel;
