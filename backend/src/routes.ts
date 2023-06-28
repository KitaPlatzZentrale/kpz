import express = require("express");

import getPaginatedKitas, {
  validator as getPaginatedKitasValidator,
} from "./entities/kitas/handler";

import kitaFinderServiceSignup, {
  validator as kitaFinderServiceSignupValidator,
} from "./entities/signups/handler/kitaFinderServiceSignup";
import singleKitaNotificationSignup, {
  validator as singleKitaNotificationSignupValidator,
} from "./entities/signups/handler/singleKitaNotificationSignup";

import revokeAccess, {
  validator as revokeAccessValidator,
} from "./entities/signups/handler/revokeConsent";

import areaNotificationSignup, {
  validator as areaNotificationSignupValidator,
} from "./entities/signups/handler/areaNotificationSignup";

import getBerlinDEKitasAtLocation from "./entities/berlin.de/handler/getBerlinDEKitasAtLocation";
import getBerlinDEKitaDetails from "./entities/berlin.de/handler/getBerlinDEKitaDetails";

import getHealthStatus from "./health";
import scrapeNewKitaData from "./scripts/iterateOverKitas";
const router = express.Router();

router.get("/kitas/:lat/:lng", getBerlinDEKitasAtLocation);
router.get("/kita/:uuid", getBerlinDEKitaDetails);

router.get(
  "/location-service/:lat/:lng/:radius/:page?/:limit?",
  getPaginatedKitasValidator,
  getPaginatedKitas
);

router.post(
  "/signup/service",
  kitaFinderServiceSignupValidator,
  kitaFinderServiceSignup
);
router.post(
  "/signup/single",
  singleKitaNotificationSignupValidator,
  singleKitaNotificationSignup
);

router.delete("/signup/:consentId", revokeAccessValidator, revokeAccess);
router.post(
  "/signup/area",
  areaNotificationSignupValidator,
  areaNotificationSignup
);

router.get("/health", getHealthStatus);
router.get("/scrape", scrapeNewKitaData);

export = router;
