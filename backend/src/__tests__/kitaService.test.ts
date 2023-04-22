import KitaService from "../kitas/service";
import haversine from "haversine-distance";
jest.mock("../models/Kita", () => ({
  __esModule: true,
  default: {
    find: () => {
      return Array.from({ length: 80 }).map((_, index) => {
        // Generate random coordinates within the search radius
        const [lat, lon] = generateRandomCoordinates({
          lat: 52.51985,
          lon: 13.38834,
          radius: 2500,
        });

        return {
          location: {
            type: "Point",
            coordinates: {
              lat,
              lon,
            },
          },
        };
      });
    },
  },
}));

describe("KitaService.getKitasInRadius", () => {
  it("should return a list of kitas within the radius sorted by distance", async () => {
    const lat = 52.51985;
    const lon = 13.38834;
    const radius = 2500;
    const page = 1;
    const limit = 10;
    const kitas = await KitaService.getKitasInRadius(
      lat,
      lon,
      radius,
      page,
      limit
    );

    expect(kitas.meta.page).toBe(page);
    expect(kitas.meta.totalPages).toBe(8);
    expect(kitas.meta.itemsPerPage).toBe(limit);
    expect(kitas.meta.amountOfItems).toBe(10);
    expect(kitas.meta.nextPage).toBe(2);
    expect(kitas.items.length).toBe(limit);

    // Calculate the distance between the search coordinates and the coordinates of each kita
    const distances = kitas.items.map((kita) =>
      haversine(
        { lat, lon },
        { lat: kita.location.coordinates[1], lon: kita.location.coordinates[0] } // [0] lon, [1] lat
      )
    );

    // Check that the distances are sorted in ascending order
    expect(distances).toEqual([...distances].sort());
  }, 10000);
});

interface ILocation {
  lat: number;
  lon: number;
  radius: number;
}

function generateRandomCoordinates({
  lat,
  lon,
  radius,
}: ILocation): [number, number] {
  const y0 = lat;
  const x0 = lon;
  const rd = radius / 111300; // Convert radius from meters to degrees

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const xp = x / Math.cos(y0);

  return [y + y0, xp + x0];
}
