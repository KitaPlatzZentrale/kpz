import { KitaDetail } from "../type";

/**
 * Transforms and translates the kita-navigator API response of a specific kita center
 * @param input ID if the kita center 
 * @returns transformed and translated json object
 */
export function kitaDetail(input: any): KitaDetail {
    const facility = input
  
    const availability: { [key: string]: boolean } = {};
    facility.einrichtungsauszug.freiplatzstatus.forEach((status: any) => {
      availability[status.gueltigAb] = status.plaetzeVerfuegbar;
    });
  
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
      imageUrl: 'https://kita-navigator.berlin.de' + facility.einrichtungsauszug.vorschaubild.url,
      capacity: {
        "total": facility.betreuung.anzahlKinder,
        "underThree": facility.betreuung.anzahlKinderUnter3
      },
      minimumAcceptanceAgeInMonths: facility.betreuung.aufnahmealter * 12,
      contactDetails: {
        email: facility.kontaktdaten.emailadresse,
        phone: facility.kontaktdaten.telefonnummer,
        website: facility.kontaktdaten.webadresse
      },
      openingHours: {
        "monday": {
          from: facility.oeffnungszeiten[0].von,
          to: facility.oeffnungszeiten[0].bis
        },
        "tuesday": {
          from: facility.oeffnungszeiten[1].von,
          to: facility.oeffnungszeiten[1].bis
        },
        "wednesday": {
          from: facility.oeffnungszeiten[2].von,
          to: facility.oeffnungszeiten[2].bis
        },
        "thursday": {
          from: facility.oeffnungszeiten[3].von,
          to: facility.oeffnungszeiten[3].bis
        },
        "friday": {
          from: facility.oeffnungszeiten[4].von,
          to: facility.oeffnungszeiten[4].bis
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
  