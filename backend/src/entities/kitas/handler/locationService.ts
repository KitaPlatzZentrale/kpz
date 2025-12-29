import { Request, Response } from "express";
import KitaDetailModel from "../model";

interface PaginatedResultsMetadata {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  amountOfItems: number;
  nextPage: number | false;
}

interface PaginatedResultsResponse<T> {
  meta: PaginatedResultsMetadata;
  items: T[];
}

function paginate<T>(data: T[], page: number, limit: number): PaginatedResultsResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / limit);

  return {
    meta: {
      page,
      totalPages,
      itemsPerPage: limit,
      totalItems: data.length,
      amountOfItems: paginatedData.length,
      nextPage: page < totalPages ? page + 1 : false,
    },
    items: paginatedData,
  };
}

/**
 * Request handler for retrieving paginated kitas within a specified radius.
 */
const locationService = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius, page, limit } = req.body;

    // Parsing parameters with default values
    const latNumber = Number(lat);
    const lngNumber = Number(lng);
    const radiusNumber = Number(radius || 2500);
    const pageNumber = Number(page || 1);
    const limitNumber = Number(limit || 50);

    if (
      isNaN(latNumber) ||
      isNaN(lngNumber) ||
      latNumber === 0 ||
      lngNumber === 0
    ) {
      return res.status(400).json({ error: "Invalid latitude or longitude provided." });
    }

    const nearestSortedKitaList = await KitaDetailModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lngNumber, latNumber], // lon has to come first!
          },
          $maxDistance: radiusNumber, // in meters
        },
      },
    }).limit(500);

    const paginatedKitas = paginate(nearestSortedKitaList, pageNumber, limitNumber);

    return res.status(200).json(paginatedKitas);
  } catch (err: any) {
    console.error("Error in locationService:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export default locationService;
