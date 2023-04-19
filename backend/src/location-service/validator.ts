import { IsDecimal,  IsLatitude, IsLongitude, validate } from "class-validator";
import logger from "../services/logger";

export class Location {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;

  @IsDecimal()
  radius: number;

  @IsDecimal()
  page: number;

  @IsDecimal()
  size: number;
}



export async function locationValidator(req: any, res: any, next: any) {
  try {
    const newLocation = new Location();
    newLocation.lat = req.params.lat;
    newLocation.lon = req.params.lon;
    newLocation.radius = req.params.radius || 2.5;
    newLocation.page = req.params.page;
    newLocation.size = req.params.size;
    
    const errors = await validate(newLocation);
    if (errors.length) {
      return res.status(400).json({ error: errors });
    }
    next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
