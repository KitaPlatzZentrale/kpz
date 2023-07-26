import KitaDetailModel from "./model";
import { Kita } from "./types";
import paginate, { PaginatedResultsResponse } from "./paginate";
import logger from "./logger";

/**
 * The KitaService class provides methods to interact with Kita data.
 */
class KitaService {
  /**
   * Retrieves a paginated list of Kitas within a specified radius from a given location.
   *
   * @param lat - The latitude of the location.
   * @param lon - The longitude of the location.
   * @param radius - The radius in meters to search for Kitas.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of Kitas to retrieve per page.
   * @returns A Promise that resolves to a paginated list of Kitas.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  public static getKitasInRadius = async (
    lat: number,
    lon: number,
    radius: number,
    page: number,
    limit: number
  ): Promise<PaginatedResultsResponse<Kita>> => {
    try {
      const nearestSortedKitaList = await KitaDetailModel.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [lon, lat], // lon has to come first!
            },
            $maxDistance: radius, // in meter
          },
        },
        version: process.env.CURRENT_KITA_DATA_VERSION,
      }).limit(50);
      const paginatedKitas = paginate(nearestSortedKitaList, page, limit);

      return paginatedKitas;
    } catch (err) {
      logger.error("Error in getKitasInRadius:", err);
      throw new Error("Something went wrong");
    }
  };
}

export default KitaService;
