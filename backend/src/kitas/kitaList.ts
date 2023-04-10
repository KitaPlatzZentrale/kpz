import { Kita } from "../type";

/**
 * Transforms and translates all the json objects from the kita-navigator API response
 * @param JSON input - The JSON response from the kita-navigator API
 * @returns {Kita[]} - A list of kita centers in JSON format
 */
export function kitaList(input: any): Kita[] {
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
