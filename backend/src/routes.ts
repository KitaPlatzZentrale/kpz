import express = require('express');
import einzelBenachrichtigungHandler from './anmeldungen/einzel';
import arealBenachrichtigungHandler from './anmeldungen/areal';
import serviceAnmeldungHandler from './anmeldungen/service';
import { locationService } from './location-service';
import { locationValidator } from './location-service/validator';
import { kitaList } from './kitas/kitaList';
import { kitaDetail } from './kitas/kitaDetail';

const router = express.Router();

router.get('/kitas/:lat/:lon', kitaList);
router.get('/kita/:uuid', kitaDetail);

router.get('/location-service', locationValidator, locationService);

router.post('/anmeldungen/service', serviceAnmeldungHandler);
router.post('/anmeldungen/einzel', einzelBenachrichtigungHandler);
router.post('/anmeldungen/areal', arealBenachrichtigungHandler);

export = router;
