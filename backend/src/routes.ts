import express = require("express");

import getPaginatedKitas from "./entities/kitas/handler";
import { validator as getPaginatedKitasValidator } from "./entities/kitas/validator";
import kitaFinderServiceSignup from "./entities/signups/handler/kitaFinderServiceSignup";
import { validator as kitaFinderServiceSignupValidator } from "./entities/signups/validator/kitaFinderServiceSignup";
import singleKitaNotificationSignup from "./entities/signups/handler/singleKitaNotificationSignup";
import { validator as singleKitaNotificationSignupValidator } from "./entities/signups/validator/singleKitaNotificationSignup";
import revokeConsent from "./entities/signups/handler/revokeConsent";
import { validator as revokeConsentValidator } from "./entities/signups/validator/revokeConsent";
import areaNotificationSignup from "./entities/signups/handler/areaNotificationSignup";
import { validator as areaNotificationSignupValidator } from "./entities/signups/validator/areaNotificationSignup";
import getHealthStatus from "./health";
import scrapeNewKitaData from "./entities/scraper/handler";
import saveChildData from "./entities/child/handler/saveChildData";
import { validator as saveChildDataValidator } from "./entities/child/validator/saveChildData";
import getChildData from "./entities/child/handler/getChildData";
import { validator as getChildDataValidator } from "./entities/child/validator/getChildData";
import { isAuthenticated, isAuthorized } from "./entities/auth/service";
import deleteUser from "./entities/user/handler/deleteUser";

import deleteOutdatedUserData from "./entities/user/handler/retentionPeriod";
import confirmConsent from "./entities/user/handler/confirmConsent";
const router = express.Router();

router.get(
  "/location-service/:lat/:lng/:radius/:page?/:limit?",
  getPaginatedKitasValidator,
  getPaginatedKitas
); // done

router.post(
  "/signup/service",
  kitaFinderServiceSignupValidator,
  kitaFinderServiceSignup // done
);
router.post(
  "/signup/single",
  singleKitaNotificationSignupValidator,
  singleKitaNotificationSignup // done
);

router.get("/revoke-consent/:consentId", revokeConsentValidator, revokeConsent); // done
router.post(
  "/signup/area",
  areaNotificationSignupValidator,
  areaNotificationSignup // done
);

router.get("/health", getHealthStatus);
router.get("/scrape", scrapeNewKitaData); // done

router.post(
  "/save-child",
  isAuthenticated,
  isAuthorized,
  saveChildDataValidator,
  saveChildData
); // done
router.get(
  "/get-child/:id",
  isAuthenticated,
  isAuthorized,
  getChildDataValidator,
  getChildData
); // done

router.delete("/user/:email", isAuthenticated, isAuthorized, deleteUser); // done

router.delete("/retention-period", deleteOutdatedUserData); // done

router.get("/confirm-consent/:consentId", confirmConsent); // done

export = router;
