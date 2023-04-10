import { IsLatitude, IsLongitude } from 'class-validator';

export class LocationValidator {
    @IsLatitude()
    lat: number;

    @IsLongitude()	
    lon: number;
  }