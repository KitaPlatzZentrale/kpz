import logger from "../../logger";
import KitaService from "./service";
import { RequestHandler } from "express";
import { IPaginatedKitasParams } from "./types";

/**
 * Request handler for retrieving paginated kitas within a specified radius.
 *
 * @param req - The request object containing the parameters.
 * @param res - The response object used to send the paginated kitas.
 * @returns A response containing the paginated kitas or an error message.
 */
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
