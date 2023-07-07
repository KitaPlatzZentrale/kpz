import logger from "../../logger";
import ChildDataModel from "../child/model";
import {
  AreaModel,
  EmailServiceSignupModel,
  UserModel,
} from "../signups/model";
import { IUser, IUserConsent } from "./types";

class User {
  public static deleteUser = async (user: IUser) => {
    try {
      // Currently we remove many but in the future this will be one when we restricted the user to only sign up once
      const doc = await EmailServiceSignupModel.findOne({
        email: user.email,
      });
      // Remove user from UserModel
      await UserModel.deleteMany({ email: user.email });
      // Remove user from EmailServiceSignupModel
      await EmailServiceSignupModel.deleteMany({
        email: user.email,
      });
      // Remove user from AreaModel
      await AreaModel.deleteMany({ email: user.email });

      // Remove encrypted child data
      await ChildDataModel.deleteMany({
        parentId: doc.id,
      });
      return;
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  };
  // limited to 3 months
  // notification for Area and SingleKitas are excluded
  // since the user wants to be updated for longer than 3 month
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

  public static confirmConsent = async (consent: IUserConsent) => {
    try {
      // think about bruteforce protection
      // maybe we should check for email + consentId
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
