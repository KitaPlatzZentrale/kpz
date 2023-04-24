import express = require("express");

import getPaginatedKitas, {
  validator as getPaginatedKitasValidator,
} from "./entities/kitas/handler";

import serviceAnmeldungHandler from "./entities/signups/handler/anmeldung";
import einzelBenachrichtigungHandler from "./entities/signups/handler/einzel";
import arealBenachrichtigungHandler from "./entities/signups/handler/areal";
import getBerlinDEKitasAtLocation from "./entities/berlin.de/handler/getBerlinDEKitasAtLocation";
import getBerlinDEKitaDetails from "./entities/berlin.de/handler/getBerlinDEKitaDetails";

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
