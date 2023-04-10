import { IsLatitude, IsLongitude, validate } from 'class-validator';

export class Location {
    @IsLatitude()
    lat: number;

    @IsLongitude()	
    lon: number;
  }


export async function locationValidator(req: any, res:any, next: any) {
  const newLocation = new Location();
  newLocation.lat = req.body.lat
  newLocation.lon = req.body.lon
  
  const errors = await validate(newLocation)
  if (errors.length) {
    res.status(400).json({ error: errors})
  }
  next()
}