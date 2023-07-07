import { RequestHandler } from "express";
import KitaService from "./entities/kitas/service";
import { EmailSignup } from "./entities/signups/service";
import { AreaModel, EmailServiceSignupModel } from "./entities/signups/model";
import { UserModel } from "./entities/signups/model";

const handler: RequestHandler = async (req, res, next) => {
  try {
    const results = [];

    // Location Service - also tests db connection
    const lat = 52.520008;
    const lon = 13.404954;
    const radius = 1000;
    const page = 1;
    const limit = 10;

    const nearestSortedKitaList = await KitaService.getKitasInRadius(
      lat,
      lon,
      radius,
      page,
      limit
    );

    const locationServiceStatus =
      nearestSortedKitaList.items.length > 0 ? 200 : 500;

    results.push({
      service: "Location Service",
      status: locationServiceStatus,
    });

    // Test EmailSignup Functions

    // 1. Test areaNotificationSignup
    const areaDescription = "Sample Area";
    const email = "darjusch.schrand@code.berlin";
    const sendEmail = false;
    const revokedAt: null | string = null;

    // const email = "test@example.com";
    const areaNotificationSignupStatus =
      await EmailSignup.areaNotificationSignup({
        email,
        areaDescription,
        revokedAt,
        sendEmail,
      });
    results.push({
      service: "areaNotificationSignup",
      status: areaNotificationSignupStatus?.email ? 200 : 500,
    });

    // 2. Test singleKitaNotificationSignup
    const kitaId = "sampleKitaId";
    const kitaDesiredAvailability = "June";
    const kitaName = "Sample Kita";
    const singleKitaNotificationSignupStatus =
      await EmailSignup.singleKitaNotificationSignup({
        email,
        kitaId,
        kitaDesiredAvailability,
        kitaName,
        sendEmail,
      });
    results.push({
      service: "singleKitaNotificationSignup",
      status: singleKitaNotificationSignupStatus?.email ? 200 : 500,
    });

    // 3. Test kitaFinderServiceSignup
    const fullAddress = "Sample Address";
    const desiredStartingMonth = "June";
    const actualOrExpectedBirthMonth = "May";
    const kitaFinderServiceSignupStatus =
      await EmailSignup.kitaFinderServiceSignup({
        email,
        fullAddress,
        desiredStartingMonth,
        actualOrExpectedBirthMonth,
        revokedAt,
        sendEmail,
      });
    results.push({
      service: "kitaFinderServiceSignup",
      status: kitaFinderServiceSignupStatus?.email ? 200 : 500,
    });

    // Clean up database after health check
    await cleanupDatabase(email);

    // Check if all services are healthy
    const isHealthy = results.every((result) => result.status === 200);

    if (isHealthy) {
      return res.status(200).json({ health: "healthy", results });
    } else {
      return res.status(503).json({ health: "unhealthy", results });
    }
  } catch (e) {
    return res.status(503).json({ health: "unhealthy", error: e.message });
  }
};

const cleanupDatabase = async (email: string) => {
  await Promise.all([
    AreaModel.deleteOne({ email }),
    EmailServiceSignupModel.deleteOne({ email }),
    UserModel.deleteOne({ email }),
  ]);
};

export default handler;
