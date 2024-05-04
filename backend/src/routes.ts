import express = require("express");

import kitaFinderServiceSignup from "./entities/signups/handler/kitaFinderServiceSignup";
import { validator as kitaFinderServiceSignupValidator } from "./entities/signups/validator/kitaFinderServiceSignup";
import singleKitaNotificationSignup from "./entities/signups/handler/singleKitaNotificationSignup";
import { validator as singleKitaNotificationSignupValidator } from "./entities/signups/validator/singleKitaNotificationSignup";
import revokeConsent from "./entities/signups/handler/revokeConsent";
import { validator as revokeConsentValidator } from "./entities/signups/validator/revokeConsent";

import confirmConsent from "./entities/user/handler/confirmConsent";
const router = express.Router();

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

router.get("/revoke-consent/:consentId", revokeConsentValidator, revokeConsent);
router.get("/confirm-consent/:consentId", confirmConsent);

export = router;
