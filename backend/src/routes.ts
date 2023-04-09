import express = require("express");
import einzelBenachrichtigungHandler from "./anmeldungen/einzel";
import arealBenachrichtigungHandler from "./anmeldungen/areal";
import serviceAnmeldungHandler from "./anmeldungen/service";
import { kitaList, kitaDetail } from "./controller";
import logger from './logger';

const router = express.Router();
const axios = require("axios");

/**
 * Finds nearby kita centers based on latitude and longitude
 * @param {number} lat - The latitude coordinate
 * @param {number} lon - The longitude coordinate
 * @returns {Kita[]} - A list of kita centers in JSON format
 */
router.get("/kitas/:lat/:lon", async (req, res) => {
  try {
    let kitas = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&lat=${req.params.lat}&lon=${req.params.lon}&seite=0&max=4000`
    );
    const result = kitaList(kitas.data);
    logger.info(`Retrieved ${result.length} kitas.`);
    res.send(result);
  } catch (err: any) {
    logger.error(err.message);
  }
});

/**
 * Returns details for a specific kita center
 * @param {string} uuid - The uuid of the kita center
 * @returns {KitaDetail} - The details of the kita center in JSON format
 */
router.get("/kita/:uuid", async (req, res) => {
  try {
    let kita = await axios.get(
      `https://kita-navigator.berlin.de/api/v1/kitas/${req.params.uuid}`
    );
    logger.info(`Retrieved details for Kita with uuid ${req.params.uuid}.`);
    const result = kitaDetail(kita.data);
    res.send(result);
  } catch (err: any) {
    logger.error(err.message);
  }
});

router.post("/anmeldungen/service", serviceAnmeldungHandler);
router.post("/anmeldungen/einzel", einzelBenachrichtigungHandler);
router.post("/anmeldungen/areal", arealBenachrichtigungHandler);

export = router;
