import { Kita } from "../type";
import { KitaDetailModel } from "../models";
import axios from "axios";
import { transformExternalKitaDetailsToKitaDetails } from "../kitas/getKitaDetails";
import logger from "../logger";
const kitas: Kita[] = require("../../data/kitas_berlin.json");
const mongoose = require("mongoose");

async function fetchKitaWithRetry(uuid: string, retries = 6): Promise<any> {
  try {
    const response = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${uuid}`
    );
    return response;
  } catch (error) {
    if (retries > 0 && error.code === "ECONNRESET") {
      console.log(
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
    const dbUrl =
      "mongodb+srv://kpz-dev:Nix123456@kitaplatzzentralecluste.dz80v4r.mongodb.net/?retryWrites=true&w=majority";
    await mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("DB connected");
        for (const kita of kitas) {
          let kitaRes = await fetchKitaWithRetry(kita.uuid);
          console.log(`Retrieved details for Kita with uuid ${kita.uuid}.`);
          const kitaDetail = transformExternalKitaDetailsToKitaDetails(
            kitaRes.data
          );
          logger.info(kitaDetail);
          await KitaDetailModel.findOneAndUpdate(
            { uuid: kitaDetail.uuid },
            kitaDetail,
            { upsert: true }
          );
        }
      })
      .catch((err: any) => console.log(`MongoDB connection error: ${err}`));
  } catch (err) {
    logger.error("Something went wrong:", err);
  } finally {
    await mongoose.connection
      .close()
      .then(() => {
        console.log("MongoDB connection closed");
      })
      .catch((error: any) => {
        console.log("Error while closing MongoDB connection:", error);
      });
  }
}

saveKitaDetailsToDB();
