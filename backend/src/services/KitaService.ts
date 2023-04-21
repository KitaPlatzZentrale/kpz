import { connectToDatabase } from "../database";
import KitaDetailModel from "../models/Kita";
import { Kita } from "../types";
import paginate, { PaginatedResultsResponse } from "../utils/paginate";

class KitaService {
  public static getKitasInRadius = async (
    lat: number,
    lon: number,
    radius: number,
    page: number,
    limit: number
  ): Promise<PaginatedResultsResponse<Kita>> => {
    await connectToDatabase();

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
    });

    const paginatedKitas = paginate(nearestSortedKitaList, page, limit);

    return paginatedKitas;
  };
}

export default KitaService;
