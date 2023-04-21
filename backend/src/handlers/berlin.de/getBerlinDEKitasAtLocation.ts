import { RequestHandler } from "express";
import logger from "../../logger";
import BerlinDEService from "../../services/external/BerlinDEService";

interface IGetBerlinDEKitaListParams {
  lat: number;
  lng: number;
}

const handler: RequestHandler<IGetBerlinDEKitaListParams> = (req, res) => {
  try {
    const { lat, lng } = req.params;

    const kitas = BerlinDEService.getKitasAtLocation(lat, lng);

    return res.status(200).send(kitas);
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
