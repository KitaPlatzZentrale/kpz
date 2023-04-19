import logger from "../../logger";
import {
  IsDecimal,
  IsLatitude,
  IsLongitude,
  IsNumber,
  validate,
} from "class-validator";
import KitaService from "../../services/KitaService";
import { RequestHandler } from "express";

require("dotenv").config();

interface IPaginatedKitasParams {
  lat: number;
  lng: number;
  radius: number;
  page?: number;
  limit?: number;
}

export class PaginatedKitasParams implements IPaginatedKitasParams {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsDecimal()
  radius: number;

  @IsNumber()
  page?: number;

  @IsNumber()
  limit?: number;
}

export const validator: RequestHandler<IPaginatedKitasParams> = async (
  req,
  res,
  next
) => {
  try {
    const newLocation = new PaginatedKitasParams();

    newLocation.lat = req.params.lat;
    newLocation.lng = req.params.lng;
    newLocation.radius = req.params.radius || 2.5;
    newLocation.page = req.params.page || 1;
    newLocation.limit = req.params.limit || 50;

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
    const { lat, lng } = req.params;
    const radius = req.params.radius || 2.5;
    const page = req.params.page || 1;
    const limit = req.params.limit || 50;

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
