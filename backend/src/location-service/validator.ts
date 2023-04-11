import { IsDecimal, IsLatitude, IsLongitude, validate } from "class-validator";

export class Location {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;

  @IsDecimal()
  radius: number;
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
    next();
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
