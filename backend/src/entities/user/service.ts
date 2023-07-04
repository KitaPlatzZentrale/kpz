import logger from "../../logger";
import ChildDataModel from "../child/model";
import {
  AreaModel,
  EmailServiceSignupModel,
  UserModel,
} from "../signups/model";

interface IUser {
  email: string;
  parentId: string;
}

class User {
  public static deleteUser = async (user: IUser) => {
    try {
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
        parentId: user.parentId,
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
}

export default User;
