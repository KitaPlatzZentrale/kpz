import express = require('express');
import einzelBenachrichtigungHandler from './anmeldungen/einzel';
import arealBenachrichtigungHandler from './anmeldungen/areal';
import serviceAnmeldungHandler from './anmeldungen/service';
import logger from './logger';
import { locationService } from './location-service';
import { locationValidator } from './location-service/validator';
import { kitaList } from './kitas/kitaList';
import { kitaDetail } from './kitas/kitaDetail';

const router = express.Router();
const axios = require('axios');


router.get('/kitas/:lat/:lon', kitaList);

/**
 * Returns details for a specific kita center
 * @param {string} uuid - The uuid of the kita center
 * @returns {KitaDetail} - The details of the kita center in JSON format
 */
router.get('/kita/:uuid', async (req, res) => {
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

router.get('/location-service', locationValidator, locationService);

router.post('/anmeldungen/service', serviceAnmeldungHandler);
router.post('/anmeldungen/einzel', einzelBenachrichtigungHandler);
router.post('/anmeldungen/areal', arealBenachrichtigungHandler);

export = router;
