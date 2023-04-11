import axios from "axios";
import { Kita } from "../type";
import { transformExternalKitaDetailsToKitaDetails } from "../kitas/getKitaDetails";
// import logger from "../logger";

const kitas: Kita[] = require("../../data/kitas_berlin.json");

async function printKitaNames(): Promise<void> {
  for (const kita of kitas) {
    console.log(kita.uuid);
    let kitaRes = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${kita.uuid}`
    );
    console.log(`Retrieved details for Kita with uuid ${kita.uuid}.`);
    const facilityObj = transformExternalKitaDetailsToKitaDetails(kitaRes.data);
    console.log(facilityObj);
  }
}

printKitaNames();
