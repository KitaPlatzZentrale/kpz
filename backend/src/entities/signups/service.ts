import logger from "../../logger";
import { UserModel, EmailServiceSignupModel } from "./model";
import { v4 as uuidv4 } from "uuid";

/**
 * KitaService class provides methods for performing signups and consent revocation.
 */

export class EmailSignup {
  /**
   * Perform signup for a single Kita notification.
   *
   * @param data - An object containing the signup data.
   * @property email - The email address of the user.
   * @property kitaId - The ID of the Kita to sign up for.
   * @property kitaDesiredAvailability - The desired availability for the Kita.
   * @property kitaName - The name of the Kita.
   * @property sendEmail - A boolean indicating whether to send an email (optional, default: true).
   *
   * @returns The created document if the signup is successful, otherwise an error is logged.
   */
  public static singleKitaNotificationSignup = async (
    data: ISingleKitaNotification
  ) => {
    try {
      const existingUser = await UserModel.findOne({ email: data.email });
      if (existingUser) {
        // Check if the kita with the given kitaId is already signed up for
        const isKitaAlreadySignedUp = existingUser.trackedKitas.some(
          (kita) => kita.id === data.kitaId
        );
        if (isKitaAlreadySignedUp) {
          // Kita is already signed up for by the user, return
          return undefined;
        }
        // Add the kita to the trackedKitas array
        existingUser.trackedKitas.push({
          id: data.kitaId,
          kitaName: data.kitaName,
          kitaAvailability: data.kitaDesiredAvailability,
        });
        await existingUser.save();
        return undefined;
      }
      const createdDocument = await UserModel.create({
        id: uuidv4(),
        email: data.email,
        trackedKitas: [
          {
            id: data.kitaId,
            kitaName: data.kitaName,
            kitaAvailability: data.kitaDesiredAvailability,
          },
        ],
        sendEmail: data.sendEmail || true,
      });
      logger.info(
        `User ${data.email} signed up for ${data.kitaName} with id ${data.kitaId}`
      );
      return createdDocument;
    } catch (e: any) {
      logger.error(`Error in singleKitaNotificationSignup service: ${e.message || e}`);
      throw e;
    }
  };
  /**
   * Perform signup for the Kita Finder Service.
   *
   * @param data - An object containing the signup data.
   * @property email - The email address of the user.
   * @property fullAddress - The full address of the user.
   * @property desiredStartingMonth - The desired starting month for the Kita.
   * @property actualOrExpectedBirthMonth - The actual or expected birth month.
   * @property revokedAt - The date when the signup was revoked (optional).
   * @property sendEmail - A boolean indicating whether to send an email (optional, default: true).
   *
   * @returns The created document if the signup is successful, otherwise an error is logged.
   */
  public static kitaFinderServiceSignup = async (
    data: IKitaFinderServiceSignup
  ) => {
    try {
      const existingUser = await EmailServiceSignupModel.findOne({
        email: data.email,
      });
      if (existingUser) {
        return undefined;
      }
      const id = uuidv4();
      const createdDocument = await EmailServiceSignupModel.create({
        id: id,
        email: data.email,
        fullAddress: data.fullAddress,
        desiredStartingMonth: data.desiredStartingMonth,
        actualOrExpectedBirthMonth: data.actualOrExpectedBirthMonth,
        revokedAt: data.revokedAt || null,
        sendEmail: data.sendEmail || true,
      });
      logger.info(`User ${data.email} signed up for kita finder service`);
      return createdDocument;
    } catch (e: any) {
      logger.error(`Error in kitaFinderServiceSignup service: ${e.message || e}`);
      throw e;
    }
  };
  /**
   * Revokes the consent and deletes associated data.
   * @param consentId - The ID of the consent to revoke.
   * @returns A Promise that resolves with no value if successful, or an error if an error occurs.
   */
  public static revokeConsent = async (consentId: string) => {
    try {
      await EmailServiceSignupModel.deleteOne({ consentId });
      await UserModel.deleteOne({ consentId });
      logger.info(`Consent ${consentId} revoked and User deleted`);
      return;
    } catch (e: any) {
      logger.error(`Error in revokeConsent service: ${e.message || e}`);
      throw e;
    }
  };
}
