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
}

export default User;
