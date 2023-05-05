import logger from "../../logger";
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  validate,
} from "class-validator";
import KitaService from "./service";
import { RequestHandler } from "express";

require("dotenv").config();

interface IPaginatedKitasParams {
  lat: string;
  lng: string;
  radius: string;
  page?: string;
  limit?: string;
}

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

const handler: RequestHandler<IPaginatedKitasParams> = async (req, res) => {
  try {
    const lat = Number(req.params.lat);
    const lng = Number(req.params.lng);
    const radius = Number(req.params.radius || 2500);
    const page = Number(req.params.page || 1);
    const limit = Number(req.params.limit || 50);

    const paginatedKitas = await KitaService.getKitasInRadius(
      lat,
      lng,
      radius,
      page,
      limit
    );

    return res.send(paginatedKitas);
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
