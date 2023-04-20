import haversineDistance from "haversine-distance";
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

    const kitaList = await KitaDetailModel.find();

    let kitasInRadius: Kita[] = [];

    kitaList.map((kita: Kita) => {
      const distance = haversineDistance(
        { lat, lon },
        { lat: kita.coordinates.lat, lon: kita.coordinates.lng }
      );
      if (distance <= radius) {
        kita.coordinates.dist = distance;
        kitasInRadius.push(kita);
      }
    });

    const sortedKitaList = this.sortKitaListByDistance(kitasInRadius);

    const paginatedKitas = paginate(sortedKitaList, page, limit);

    return paginatedKitas;
  };

  private static sortKitaListByDistance = (list: Kita[]) =>
    list.sort((a, b) => {
      return a.coordinates.dist - b.coordinates.dist;
    });
}

export default KitaService;
