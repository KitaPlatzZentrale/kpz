import axios from "axios";
import logger from "../services/logger";
import { Kita } from "../types";
import { KitaDetailModel } from "../models";
import {
  closeDatabaseConnection,
  connectToDatabase,
} from "../services/database";
import { transformExternalKitaDetailsToKitaDetails } from "../kitas/getKitaDetails";

const kitas: Kita[] = require("../../data/kitas_berlin.json");

async function fetchKitaWithRetry(uuid: string, retries = 6): Promise<any> {
  try {
    const response = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${uuid}`
    );
    return response;
  } catch (error) {
    if (retries > 0 && error.code === "ECONNRESET") {
      logger.error(
        `Error with uuid ${uuid}: ${error.message}. Retrying in 10 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return await fetchKitaWithRetry(uuid, retries - 1);
    } else {
      throw error;
    }
  }
}

async function saveKitaDetailsToDB(): Promise<void> {
  try {
    await connectToDatabase();
    for (const kita of kitas) {
      let kitaRes = await fetchKitaWithRetry(kita.uuid);
      const kitaDetail = transformExternalKitaDetailsToKitaDetails(
        kitaRes.data
      );
      logger.info(JSON.stringify(kitaDetail));
      await KitaDetailModel.findOneAndUpdate(
        { uuid: kitaDetail.uuid },
        kitaDetail,
        { upsert: true }
      );
    }
  } catch (err) {
    logger.error("Something went wrong:", err);
  } finally {
    closeDatabaseConnection();
  }
}

saveKitaDetailsToDB();
