"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const sendNotification_1 = require("../sender/sendNotification");
const handler = async (event, context) => {
    const eventType = event["detail-type"];
    const email = event.detail.fullDocument.email;
    if (!email) {
        throw new Error("No recipient with `to` specified");
    }
    try {
        switch (eventType) {
            case "MongoDB Database Trigger for test.users":
                await (0, sendNotification_1.sendSlackEmailNotification)({
                    email,
                    eventDescription: "New User Signup",
                });
                break;
            case "MongoDB Database Trigger for test.emailservices":
                await (0, sendNotification_1.sendSlackEmailNotification)({
                    email,
                    eventDescription: "New Email Service Signup",
                });
                break;
            case "MongoDB Database Trigger for realData.kitadetails":
                await (0, sendNotification_1.sendSlackEmailNotification)({
                    email,
                    eventDescription: "New Kita Details Signup",
                });
                break;
            default:
                console.log(`Unrecognized event type: ${eventType}`);
                break;
        }
    }
    catch (error) {
        console.error("Error sending notification:", error);
    }
};
exports.handler = handler;
