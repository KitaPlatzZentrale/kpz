import logger from "../../logger";
import { KitaDetail } from "../../types";
import KitaDetailModel from "../kitas/model";
import BerlinDEService from "../berlin.de/service";
import crypto from "crypto";

class KitaScraper {
  private static generateHash(data: any): string {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
  }

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

  private static async getKitasByUUIDs(uuids: number[]): Promise<KitaDetail[]> {
    try {
      const kitas = [];
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

  public static async checkIfKitaDetailVersionNeedsUpdate(): Promise<boolean> {
    try {
      const kitaList = await BerlinDEService.getKitaList();
      const kitaListHash = this.generateHash(kitaList);
      const kitaFromCurrentVersion = await KitaDetailModel.findOne({
        version: process.env.CURRENT_KITA_DATA_VERSION,
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

  public static async saveNewKitaDetailVersionToDB(): Promise<void> {
    const session = await KitaDetailModel.startSession();
    try {
      session.startTransaction();
      let kitaList = await BerlinDEService.getKitaList();
      const kitaIds = await BerlinDEService.getAllKitaUUIDs(kitaList);
      const kitaListHash = this.generateHash(kitaList);
      const newKitas = await this.getKitasByUUIDs(kitaIds);
      newKitas.map((kita) => {
        kita.version = process.env.CURRENT_KITA_DATA_VERSION;
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

  public static async deleteOldestKitaDetailVersionFromDB(): Promise<void> {
    const session = await KitaDetailModel.startSession();
    try {
      session.startTransaction();
      const oldestValidKitaDetailVersion =
        Number(process.env.CURRENT_KITA_DATA_VERSION) - 1;
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
