import KitaDetailModel from "./model";
import { Kita } from "../../types";
import paginate, { PaginatedResultsResponse } from "../../utils/paginate";
import logger from "../../logger";
import dotenv from "dotenv";
dotenv.config();

const CURRENT_KITA_DATA_VERSION = process.env.CURRENT_KITA_DATA_VERSION;
if (!CURRENT_KITA_DATA_VERSION)
  throw new Error("CURRENT_KITA_DATA_VERSION not set in .env");

class KitaService {
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
        version: CURRENT_KITA_DATA_VERSION,
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
