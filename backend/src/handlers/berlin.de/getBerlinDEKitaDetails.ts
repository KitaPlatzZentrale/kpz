import { RequestHandler } from "express";
import logger from "../../logger";
import BerlinDEService from "../../services/external/BerlinDEService";

interface IGetBerlinDEKitaList {
  uuid: string;
}

const handler: RequestHandler<IGetBerlinDEKitaList> = (req, res) => {
  try {
    const { uuid } = req.params;

    const kita = BerlinDEService.getKitaDetails(uuid);

    return res.status(200).send(kita);
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
