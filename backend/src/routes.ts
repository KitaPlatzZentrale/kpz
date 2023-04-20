import express = require("express");

import getBerlinDEKitasAtLocation from "./handlers/berlin.de/getBerlinDEKitasAtLocation";
import getBerlinDEKitaDetails from "./handlers/berlin.de/getBerlinDEKitaDetails";

import getPaginatedKitas, {
  validator as getPaginatedKitasValidator,
} from "./handlers/kitas/getPaginatedKitas";

import serviceAnmeldungHandler from "./handlers/signups/service";
import einzelBenachrichtigungHandler from "./handlers/signups/einzel";
import arealBenachrichtigungHandler from "./handlers/signups/areal";

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
