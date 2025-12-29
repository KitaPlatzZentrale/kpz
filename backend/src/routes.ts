import express = require("express");

import kitaFinderServiceSignup from "./entities/signups/handler/kitaFinderServiceSignup";
import singleKitaNotificationSignup from "./entities/signups/handler/singleKitaNotificationSignup";
import revokeConsent from "./entities/signups/handler/revokeConsent";
import confirmConsent from "./entities/user/handler/confirmConsent";
import locationService from "./entities/kitas/handler/locationService";

const router = express.Router();

router.post("/location-service", locationService);
router.post("/signup/kita-finder", kitaFinderServiceSignup);
router.post("/signup/single", singleKitaNotificationSignup);
router.get("/revoke-consent/:consentId", revokeConsent);
router.get("/confirm-consent/:consentId", confirmConsent);

export = router;
