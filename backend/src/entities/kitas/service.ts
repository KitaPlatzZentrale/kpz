import KitaDetailModel from "./model";
import { Kita } from "../../types";
import paginate, { PaginatedResultsResponse } from "../../utils/paginate";

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
      });
      const paginatedKitas = paginate(nearestSortedKitaList, page, limit);

      return paginatedKitas;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  };
}

export default KitaService;
