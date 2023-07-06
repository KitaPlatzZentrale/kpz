import logger from "../logger";
import { KitaDetail } from "../types";
import KitaDetailModel from "../entities/kitas/model";
import BerlinDEService from "../entities/berlin.de/service";
import crypto from "crypto";
import { Request, RequestHandler, Response } from "express";
require("dotenv").config();

const CURRENT_KITA_DATA_VERSION = process.env.CURRENT_KITA_DATA_VERSION;
if (!CURRENT_KITA_DATA_VERSION) {
  throw new Error("No CURRENT_KITA_DATA_VERSION found in .env");
}

async function fetchKitaWithRetry(
  uuid: number,
  retries = 6
): Promise<KitaDetail> | null {
  try {
    const response = await BerlinDEService.getKitaDetails(uuid);

    if (!response) {
      throw new Error(`fetchKitaWithRetry: No response for uuid ${uuid}`);
    }

    return response;
  } catch (error) {
    if (retries > 0 && error.code === "ECONNRESET") {
      logger.error(
        `Error with uuid ${uuid}: ${error.message}. Retrying in 10 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return await fetchKitaWithRetry(uuid, retries - 1);
    } else {
      return null;
    }
  }
}

async function getKitasByUUIDs(uuids: number[]): Promise<KitaDetail[]> {
  try {
    const kitas = [];
    for (const uuid of uuids) {
      let kita = await fetchKitaWithRetry(uuid);
      if (kita !== null) {
        kitas.push(kita);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return kitas;
  } catch (error) {
    logger.error("Error in fetchKitasByUUIDs:", error);
    throw error;
  }
}

const generateHash = (data: any) => {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(data));
  return hash.digest("hex");
};

async function checkIfKitaDetailVersionNeedsUpdate(): Promise<boolean> {
  try {
    const kitaList = await BerlinDEService.getKitaList();
    const kitaListHash = generateHash(kitaList);
    const kitaFromCurrentVersion = await KitaDetailModel.findOne({
      version: CURRENT_KITA_DATA_VERSION,
    });
    if (kitaFromCurrentVersion) {
      if (kitaListHash === kitaFromCurrentVersion.checkSum) {
        return false;
      }
    }
    return true;
  } catch (err) {
    logger.error("Something went wrong:", err);
    throw err;
  }
}
// get all UUIDS
// fetch kita details for each UUID
// get current version number from DB or ENV
// save them to datastructure with version number +1
// save datastructure to DB
// delete oldest version from DB
// check wether data needs to be scraped again

async function saveNewKitaDetailVersionToDB(): Promise<void> {
  const session = await KitaDetailModel.startSession();
  try {
    session.startTransaction();
    let kitaList = await BerlinDEService.getKitaList();
    const kitaIds = await BerlinDEService.getAllKitaUUIDs(kitaList);
    const kitaListHash = generateHash(kitaList);
    const newKitas = await getKitasByUUIDs(kitaIds);
    newKitas.map((kita) => {
      kita.version = CURRENT_KITA_DATA_VERSION;
      kita.checkSum = kitaListHash;
    });
    await KitaDetailModel.insertMany(newKitas, { session });
    await session.commitTransaction();
  } catch (err) {
    logger.error("Something went wrong:", err);
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

export async function deleteOldestKitaDetailVersionFromDB(): Promise<void> {
  const session = await KitaDetailModel.startSession();
  try {
    session.startTransaction();
    const oldestValidKitaDetailVersion = Number(CURRENT_KITA_DATA_VERSION) - 1;
    if (oldestValidKitaDetailVersion > 0) {
      await KitaDetailModel.deleteMany(
        {
          version: oldestValidKitaDetailVersion,
        },
        { session }
      );
      await session.commitTransaction();
    }
  } catch (err) {
    logger.error("Something went wrong:", err);
  } finally {
    session.endSession();
  }
}

export const handler: RequestHandler<any, any> = async (
  req: Request,
  res: Response
) => {
  try {
    // check if x-api-key is set
    if (!req.headers["x-api-key"]) {
      return res.status(401).json({ message: "No API key provided" });
    }
    // check if x-api-key is correct
    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      return res.status(401).json({ message: "Wrong API key provided" });
    }
    const updateForKitaDetailRequired =
      await checkIfKitaDetailVersionNeedsUpdate();
    if (updateForKitaDetailRequired) {
      await saveNewKitaDetailVersionToDB();

      return res.status(200).json({ message: "Kitas updated" });
    }
    return res.status(200).json({ message: "Kitas already up to date" });
  } catch (err) {
    logger.error("Something went wrong:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;
