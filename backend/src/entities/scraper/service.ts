import logger from "../../logger";
import { KitaDetail } from "../../types";
import KitaDetailModel from "../kitas/model";
import BerlinDEService from "../berlin.de/service";
import crypto from "crypto";
import getLatestDataVersion from "../../utils/getLatestDataVersion";

class KitaScraper {
  /**
   * Generates a hash string for the provided data.
   *
   * @param data - The data to generate the hash for.
   * @returns The generated hash string.
   */
  private static generateHash(data: any): string {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
  }

  /**
   * Fetches the Kita details for the provided UUID with retry mechanism.
   *
   * @param uuid - The UUID of the Kita to fetch.
   * @param retries - The number of retries (default: 6).
   * @returns A Promise resolving to the KitaDetail or null if not found.
   */
  private static async fetchKitaWithRetry(
    uuid: number,
    retries = 6
  ): Promise<KitaDetail | null> {
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
        return await this.fetchKitaWithRetry(uuid, retries - 1);
      } else {
        return null;
      }
    }
  }

  /**
   * Fetches Kitas for the provided UUIDs.
   *
   * @param uuids - The UUIDs of the Kitas to fetch.
   * @returns A Promise resolving to an array of KitaDetails.
   */
  private static async getKitasByUUIDs(uuids: number[]): Promise<KitaDetail[]> {
    try {
      const kitas: KitaDetail[] = [];

      for (const uuid of uuids) {
        let kita = await this.fetchKitaWithRetry(uuid);

        if (kita !== null) {
          kitas.push(kita);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return kitas;
    } catch (error) {
      logger.error("Error in getKitasByUUIDs:", error);
      throw error;
    }
  }

  /**
   * Checks if the Kita detail version needs to be updated.
   *
   * @returns A Promise resolving to a boolean indicating if an update is needed.
   */
  public static async checkIfKitaDetailVersionNeedsUpdate(): Promise<boolean> {
    try {
      const latestVersion = await getLatestDataVersion();
      const kitaList = await BerlinDEService.getKitaList();
      const kitaListHash = this.generateHash(kitaList);
      const kitaFromCurrentVersion = await KitaDetailModel.findOne({
        version: latestVersion,
      });

      if (
        kitaFromCurrentVersion &&
        kitaListHash === kitaFromCurrentVersion.checkSum
      ) {
        return false;
      }

      return true;
    } catch (err) {
      logger.error("Something went wrong:", err);
      throw err;
    }
  }

  /**
   * Saves the new Kita detail version to the database.
   *
   * @returns A Promise resolving to void.
   */
  public static async saveNewKitaDetailVersionToDB(): Promise<void> {
    const session = await KitaDetailModel.startSession();

    try {
      const latestVersion = await getLatestDataVersion();
      session.startTransaction();
      const kitaList = await BerlinDEService.getKitaList();
      const kitaIds = await BerlinDEService.getAllKitaUUIDs(kitaList);
      const kitaListHash = this.generateHash(kitaList);
      const newKitas = await this.getKitasByUUIDs(kitaIds);

      newKitas.forEach((kita) => {
        kita.version = String(Number(latestVersion) + 1);
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

  /**
   * Deletes the oldest Kita detail version from the database.
   *
   * @returns A Promise resolving to void.
   */
  public static async deleteOldestKitaDetailVersionFromDB(): Promise<void> {
    const session = await KitaDetailModel.startSession();

    try {
      const latestVersion = await getLatestDataVersion();
      session.startTransaction();
      const oldestValidKitaDetailVersion = Number(latestVersion) - 1;

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
}

export default KitaScraper;
