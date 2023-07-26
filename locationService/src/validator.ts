import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  validate,
} from "class-validator";
import { RequestHandler } from "express";
import { IPaginatedKitasParams } from "./types";
import logger from "./logger";

export class PaginatedKitasParams {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsNumber()
  radius: number;

  @IsInt()
  page?: number;

  @IsInt()
  limit?: number;
}

export const validator: RequestHandler<IPaginatedKitasParams> = async (
  req,
  res,
  next
) => {
  try {
    const newLocation = new PaginatedKitasParams();

    newLocation.lat = Number(req.params.lat);
    newLocation.lng = Number(req.params.lng);
    newLocation.radius = Number(req.params.radius || 2500);
    newLocation.page = Number(req.params.page || 1);
    newLocation.limit = Number(req.params.limit || 50);

    const errors = await validate(newLocation);

    if (errors.length) return res.status(400).json({ error: errors });

    return next();
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
