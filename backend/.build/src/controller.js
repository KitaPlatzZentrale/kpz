"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateKitalistJson = void 0;
function translateKitalistJson(input) {
    const facilities = input.einrichtungen.map((facility) => {
        const availability = {};
        facility.freiplatzstatus.forEach((status) => {
            availability[status.gueltigAb] = status.plaetzeVerfuegbar;
        });
        const facilityObj = {
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
exports.translateKitalistJson = translateKitalistJson;
//# sourceMappingURL=controller.js.map