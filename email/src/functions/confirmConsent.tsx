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
    await EmailServiceSignupModel.updateOne(
      { consentId: event.pathParameters.consentId },
      { $set: { consentedAt: Date.now() } }
    );
    await UserModel.updateOne(
      { consentId: event.pathParameters.consentId },
      { $set: { consentedAt: Date.now() } }
    );
    console.log(
      "event.pathParameters confirmed for event.pathParameters ID: ",
      event.pathParameters.consentId
    );
    return "Consent confirmed";
  } catch (error) {
    console.error(error);
    throw error;
  }
};
