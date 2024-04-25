import logger from "../../logger";
import { KitaDetail } from "../../types";
import KitaDetailModel from "../kitas/model";
import BerlinDEService from "../berlin.de/service";
import { FilterQuery } from "mongoose";

class KitaScraper {
  private static async getKitasByUUIDs(uuids: number[]): Promise<KitaDetail[]> {
    try {
      const batchSize = 100; // Number of UUIDs to process in each batch
      const kitas: KitaDetail[] = [];

      for (let i = 0; i < uuids.length; i += batchSize) {
        const batchUuids = uuids.slice(i, i + batchSize);
        const batchPromises = batchUuids.map(async (uuid) => {
          try {
            const response = await BerlinDEService.getKitaDetails(uuid);
            if (!response) {
              throw new Error(`No response for uuid ${uuid}`);
            }
            return response;
          } catch (error) {
            logger.error(`Error with uuid ${uuid}: ${error.message}.`);
            return null;
          }
        });

        const responses = await Promise.all(batchPromises);

        // Filter out null responses
        const batchKitas: KitaDetail[] = responses.filter(
          (kita) => kita !== null
        ) as KitaDetail[];
        kitas.push(...batchKitas);

        // Insert a small timeout between batches
        await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the timeout value as needed
      }

      return kitas;
    } catch (error) {
      logger.error("Error in getKitasByUUIDs:", error);
      throw error;
    }
  }

  /**
   * Saves the new Kita detail version to the database.
   *
   * @returns A Promise resolving to void.
   */
  public static async updateKitaDetails(): Promise<void> {
    const session = await KitaDetailModel.startSession();

    try {
      session.startTransaction();
      const kitaList = await BerlinDEService.getKitaList();
      const kitaIds = await BerlinDEService.getAllKitaUUIDs(kitaList);
      const newKitas = await this.getKitasByUUIDs(kitaIds);

      // Prepare the bulk write operations to replace existing Kita details
      const bulkOps = newKitas.map((newKita) => {
        const filter: FilterQuery<KitaDetail> = { uuid: newKita.uuid }; // Assuming uuid is the unique identifier
        return {
          replaceOne: {
            filter,
            replacement: newKita,
            upsert: true, // If the document doesn't exist, create it
          },
        } as any; // Add type assertion here
      });

      // Execute the bulk write operations
      await KitaDetailModel.bulkWrite(bulkOps, { session });

      await session.commitTransaction();
    } catch (err) {
      logger.error("Something went wrong:", err);
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
export default KitaScraper;
