import express = require("express");

import getPaginatedKitas, {
  validator as getPaginatedKitasValidator,
} from "./kitas/handler";

import serviceAnmeldungHandler from "./signups/handler/anmeldung";
import einzelBenachrichtigungHandler from "./signups/handler/einzel";
import arealBenachrichtigungHandler from "./signups/handler/areal";
import getBerlinDEKitasAtLocation from "./berlin.de/handler/getBerlinDEKitasAtLocation";
import getBerlinDEKitaDetails from "./berlin.de/handler/getBerlinDEKitaDetails";

const router = express.Router();

router.get("/kitas/:lat/:lng", getBerlinDEKitasAtLocation);
router.get("/kita/:uuid", getBerlinDEKitaDetails);

router.get(
  "/location-service/:lat/:lng/:radius/:page?/:limit?",
  getPaginatedKitasValidator,
  getPaginatedKitas
);

router.post("/anmeldungen/service", serviceAnmeldungHandler);
router.post("/anmeldungen/einzel", einzelBenachrichtigungHandler);
router.post("/anmeldungen/areal", arealBenachrichtigungHandler);

export = router;
