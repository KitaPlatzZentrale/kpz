import axios from "axios";
import { Kita } from "../type";
import { kitaDetail } from "../controller";
import logger from "../logger";

const kitas: Kita[] = require("../../data/kitas_berlin.json");

async function printKitaNames(): Promise<void> {
  for (const kita of kitas) {
    console.log(kita.uuid);
    let kita_res = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${kita.uuid}`
    );
    logger.info(`Retrieved details for Kita with uuid ${kita.uuid}.`);
    const result = kitaDetail(kita_res.data);
    logger.info(result);
  }
}

printKitaNames();
