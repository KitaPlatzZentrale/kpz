import logger from "../logger";
import { KitaDetail } from "../types";
import KitaDetailModel from "../entities/kitas/model";
import { closeDatabaseConnection, connectToDatabase } from "../database";
import BerlinDEService from "../entities/berlin.de/service";

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

async function saveKitaDetailsToDB(): Promise<void> {
  try {
    await connectToDatabase();
    const kitaIds = await BerlinDEService.getAllKitaUUIDs();
    for (const kitaId of kitaIds) {
      let updatedKita = await fetchKitaWithRetry(kitaId);
      if (updatedKita !== null) {
        logger.info(JSON.stringify(updatedKita));
        await KitaDetailModel.findOneAndUpdate(
          { uuid: updatedKita.uuid },
          updatedKita,
          { upsert: true }
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } catch (err) {
    logger.error("Something went wrong:", err);
  } finally {
    closeDatabaseConnection();
  }
}

saveKitaDetailsToDB();
