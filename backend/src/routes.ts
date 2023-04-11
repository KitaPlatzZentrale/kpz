import express = require("express");
import einzelBenachrichtigungHandler from "./anmeldungen/einzel";
import arealBenachrichtigungHandler from "./anmeldungen/areal";
import serviceAnmeldungHandler from "./anmeldungen/service";
import { locationService } from "./location-service";
import { locationValidator } from "./location-service/validator";
import { getKitaList } from "./kitas/getKitaList";
import { getKitaDetailsExternal } from "./kitas/getKitaDetails";

const router = express.Router();

router.get("/kitas/:lat/:lon", getKitaList);
router.get("/kita/:uuid", getKitaDetailsExternal);

router.get(
  "/location-service/:lat/:lon/:radius",
  locationValidator,
  locationService
);

router.post("/anmeldungen/service", serviceAnmeldungHandler);
router.post("/anmeldungen/einzel", einzelBenachrichtigungHandler);
router.post("/anmeldungen/areal", arealBenachrichtigungHandler);

export = router;
