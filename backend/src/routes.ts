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
import saveChildData, {
  validator as saveChildDataValidator,
} from "./entities/child/handler/saveChildData";
import getChildData, {
  validator as getChildDataValidator,
} from "./entities/child/handler/getChildData";
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

router.post("/save-child", saveChildDataValidator, saveChildData);
router.get("/get-child", getChildDataValidator, getChildData);
export = router;
