import logger from "../../logger";
import { createDataKey } from "../child/encryption";
import { UserModel, EmailServiceSignupModel, AreaModel } from "./model";
import { v4 as uuidv4 } from "uuid";

export class EmailSignup {
  public static areaNotificationSignup = async (
    email: string,
    areaDescription: string,
    revokedAt?: string | null,
    sendEmail?: boolean
  ) => {
    try {
      const existingUser = await AreaModel.findOne({
        email,
      });
      if (existingUser) {
        return;
      }
      const createdDocument = await AreaModel.create({
        email,
        areaDescription,
        revokedAt,
        sendEmail,
      });
      logger.info(`User ${email} signed up for ${areaDescription}`);
      return createdDocument;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };
  public static singleKitaNotificationSignup = async (
    email: string,
    kitaId: string,
    kitaDesiredAvailability: string,
    kitaName: string,
    sendEmail?: boolean
  ) => {
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        // Check if the kita with the given kitaId is already signed up for
        const isKitaAlreadySignedUp = existingUser.trackedKitas.some(
          (kita) => kita.id === kitaId
        );
        if (isKitaAlreadySignedUp) {
          // Kita is already signed up for by the user, return
          return;
        }
        // Add the kita to the trackedKitas array
        existingUser.trackedKitas.push({
          id: kitaId,
          kitaName,
          kitaAvailability: kitaDesiredAvailability,
        });
        await existingUser.save();
        return;
      }
      const createdDocument = await UserModel.create({
        id: uuidv4(),
        email,
        trackedKitas: [
          {
            id: kitaId,
            kitaName,
            kitaAvailability: kitaDesiredAvailability,
          },
        ],
        sendEmail,
      });
      logger.info(`User ${email} signed up for ${kitaName} with id ${kitaId}`);
      return createdDocument;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };

  public static kitaFinderServiceSignup = async (
    email: string,
    fullAddress: string,
    desiredStartingMonth: string,
    actualOrExpectedBirthMonth: string,
    revokedAt: string | null,
    sendEmail?: boolean
  ) => {
    try {
      const existingUser = await EmailServiceSignupModel.findOne({ email });
      if (existingUser) {
        return;
      }
      const id = uuidv4();
      const createdDocument = await EmailServiceSignupModel.create({
        id: id,
        email,
        fullAddress,
        desiredStartingMonth,
        actualOrExpectedBirthMonth,
        revokedAt,
        sendEmail,
      });
      await createDataKey(id);
      logger.info(`User ${email} signed up for kita finder service`);
      return createdDocument;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };

  public static revokeConsent = async (consentId: string) => {
    try {
      await EmailServiceSignupModel.deleteOne({ consentId });
      await AreaModel.deleteOne({ consentId });
      await UserModel.deleteOne({ consentId });
      logger.info(`Consent ${consentId} revoked and User deleted`);
      return;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };
}
