import KitaService from "../services/KitaService";

// mock KitaModel.find() to return a list of kitas
jest.mock("../models/Kita", () => ({
  __esModule: true,
  default: {
    find: () => {
      return Array.from({ length: 80 }).map((_, index) => {
        return {
          coordinates: {
            lat: 52.51985,
            lng: 13.38834,
            dist: index * 100,
          },
        };
      });
    },
  },
}));

describe("KitaService.getKitasInRadius", () => {
  it("should return a list of kitas within the radius", async () => {
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
    // distance should not be null in returned list!
    expect(kitas.items.every((item) => item.coordinates.dist !== null)).toBe(
      true
    );

    // check if kitas.items are sorted by distance
    for (let i = 1; i < kitas.items.length; i++) {
      expect(kitas.items[i].coordinates.dist).toBeGreaterThanOrEqual(
        kitas.items[i - 1].coordinates.dist
      );
    }
  }, 10000);
});