import { IsDecimal, IsLatitude, IsLongitude, IsNumber, validate } from "class-validator";
import logger from "../services/logger";

export class Location {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;

  @IsDecimal()
  radius: number;

}

export class Pagination {
  @IsNumber()
  page: number;

  @IsNumber()
  size: number;
}


export async function locationValidator(req: any, res: any, next: any) {
  try {
    const newLocation = new Location();
    newLocation.lat = req.params.lat;
    newLocation.lon = req.params.lon;
    newLocation.radius = req.params.radius || 2.5;
    
    const errors = await validate(newLocation);
    if (errors.length) {
      return res.status(400).json({ error: errors });
    }
    
    const newPagination = new Pagination();
    newPagination.page = req.params.page;
    newPagination.size = req.params.size;

    const paginationErrors = await validate(newPagination)
    if (paginationErrors.length) {
      return res.status(400).json({ errors: paginationErrors})
    }

    next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
