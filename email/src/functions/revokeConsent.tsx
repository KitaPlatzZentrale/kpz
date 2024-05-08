import type { Handler } from "aws-lambda";
import dotenv from "dotenv";
import { EmailServiceSignupModel, UserModel } from "../models/user";
import mongoose, { ConnectOptions } from "mongoose";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable not found");
}

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions);

export const handler: Handler = async (event: any, ctx) => {
  try {
    console.log("Event", event);
    const consentId = event.pathParameters.consentId;
    await EmailServiceSignupModel.deleteOne({ consentId });
    await UserModel.deleteOne({ consentId });
    console.info(`Consent ${consentId} revoked and User deleted`);
    return "Consent revoked";
  } catch (e) {
    console.error(e);
    return e;
  }
};
