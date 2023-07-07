import logger from "../../logger";
import ChildDataModel from "../child/model";
import {
  AreaModel,
  EmailServiceSignupModel,
  UserModel,
} from "../signups/model";
import { IUser, IUserConsent } from "./types";
/**
 * The User class provides static methods for managing user data and consent.
 */
class User {
  /**
   * Delete a user and associated data.
   *
   * @param user - An object containing the user email.
   * @property email - The email address of the user.
   *
   * @returns A Promise that resolves with no value if the deletion is successful.
   * @throws An error if an error occurs during the deletion process.
   */
  public static deleteUser = async (user: IUser) => {
    try {
      const doc = await EmailServiceSignupModel.findOne({
        email: user.email,
      });

      await UserModel.deleteMany({ email: user.email });
      await EmailServiceSignupModel.deleteMany({ email: user.email });
      await AreaModel.deleteMany({ email: user.email });
      await ChildDataModel.deleteMany({ parentId: doc.id });

      return;
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  };

  /**
   * Delete outdated user data based on consented date.
   * Data older than 3 months will be deleted.
   *
   * @returns A Promise that resolves with no value if the deletion is successful.
   * @throws An error if an error occurs during the deletion process.
   */
  public static deleteOutdatedUserData = async () => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    try {
      await EmailServiceSignupModel.deleteMany({
        consentedAt: { $lt: threeMonthsAgo },
      });
      await ChildDataModel.deleteMany({
        consentedAt: { $lt: threeMonthsAgo },
      });
      return;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

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
      await AreaModel.updateOne(
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
