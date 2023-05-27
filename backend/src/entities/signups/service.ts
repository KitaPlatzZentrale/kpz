import logger from "../../logger";
import { UserModel, EmailServiceSignupModel } from "./model";
import { v4 as uuidv4 } from "uuid";

export class EmailSignup {
  public static singleKitaNotificationSignup = async (
    email: string,
    kitaId: string,
    kitaDesiredAvailability: string,
    kitaName: string
  ) => {
    try {
      // needs logic if user already exists but then MongoDB triggers might have to be adjusted aswell
      await UserModel.create({
        id: uuidv4(),
        email,
        trackedKitas: [
          {
            id: kitaId,
            kitaName,
            kitaAvailability: kitaDesiredAvailability,
          },
        ],
      });
      logger.info(`User ${email} signed up for ${kitaName} with id ${kitaId}`);
      return;
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
    revokedAt: string | null
  ) => {
    try {
      // needs logic if user already exists but then MongoDB triggers might have to be adjusted aswell
      await EmailServiceSignupModel.create({
        id: uuidv4(),
        email,
        fullAddress,
        desiredStartingMonth,
        actualOrExpectedBirthMonth,
        revokedAt,
      });
      logger.info(`User ${email} signed up for kita finder service`);
      return;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };

  public static revokeConsent = async (consentId: string) => {
    try {
      await EmailServiceSignupModel.deleteOne({ consentId });
      logger.info(`Consent ${consentId} revoked and User deleted`);
      return;
    } catch (e) {
      logger.error(e);
      return e;
    }
  };
}
