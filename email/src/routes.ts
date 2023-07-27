import express from "express";
import sendAreaNotification from "./functions/sendAreaNotificationsEmail";
import sendServiceSingupEmail from "./functions/sendServiceSignupEmail";
import sendSingleKitaNotificationsEmail from "./functions/sendSingleKitaNotificationsEmail";
const router = express.Router();

router.post("/areaService", sendAreaNotification);
router.post("/finderService", sendServiceSingupEmail);
router.post("/singleKitaService", sendSingleKitaNotificationsEmail);

export default router;
