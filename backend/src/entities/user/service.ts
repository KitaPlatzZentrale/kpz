import logger from "../../logger";
import { EmailServiceSignupModel, UserModel } from "../signups/model";
import { IUserConsent } from "./types";
/**
 * The User class provides static methods for managing user data and consent.
 */
class User {
  /**
   * Confirm user consent by updating consentedAt date.
   *
   * @param consent - An object containing the consent ID.
   * @property consentId - The ID of the consent to confirm.
   *
   * @returns A Promise that resolves with no value if the confirmation is successful.
   * @throws An error if an error occurs during the confirmation process.
   */
  public static confirmConsent = async (consent: IUserConsent) => {
    try {
      await EmailServiceSignupModel.updateOne(
        { consentId: consent.consentId },
        { $set: { consentedAt: Date.now() } }
      );
      await UserModel.updateOne(
        { consentId: consent.consentId },
        { $set: { consentedAt: Date.now() } }
      );
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };
}

export default User;
