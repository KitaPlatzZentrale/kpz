import { Kita } from "../type";
import { KitaDetailModel } from "../models";
import axios from "axios";
import { transformExternalKitaDetailsToKitaDetails } from "../kitas/getKitaDetails";
import logger from "../logger";
const kitas: Kita[] = require("../../data/kitas_berlin.json");
const mongoose = require("mongoose");

async function saveKitaDetailsToDB(): Promise<void> {
  try {
    const dbUrl =
      "mongodb+srv://kpz-dev:Nix123456@kitaplatzzentralecluste.dz80v4r.mongodb.net/?retryWrites=true&w=majority";
    mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("DB connected");
        // current kita tracken
        // if connection reset
        // start again at this kita
        for (const kita of kitas) {
          // console.log(kita.uuid);
          let kitaRes = await axios.get(
            `https://kita-navigator.berlin.de/api/v1/kitas/${kita.uuid}`
          );
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
    console.log("Something went wrong");
    console.log(err);
  }
}

saveKitaDetailsToDB();
