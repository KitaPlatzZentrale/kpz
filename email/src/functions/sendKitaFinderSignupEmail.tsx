import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import { v4 as uuidv4 } from "uuid";

import type { APIGatewayEvent, Handler } from "aws-lambda";
import ServiceSignupEmail from "../templates/Kitafinder";
// import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";
import { EmailServiceSignupModel } from "../models/user";
import mongoose, { ConnectOptions } from "mongoose";

dotenv.config();
/**
 * Lambda Function: ServiceSignupEmailHandler
 *
 * Description:
 * This Lambda function handles sending service signup emails to recipients.
 * It receives an event object containing the details of the signup, including the email address, consent ID,
 * and other relevant information.
 * The function validates the required properties and generates the email body using the provided props.
 * Finally, it sends the email using the sendEmail function.
 *
 * ...
 */
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable not found");
}
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions);

export const handler: Handler<APIGatewayEvent> = async (event) => {
  // const SNS = setupSNS();
  // if (!process.env.SNS_ERROR_ARN)
  //   throw new Error("No SNS_ERROR_ARN specified in environment variables");
  // if (!process.env.SNS_SUCCESS_ARN)
  //   throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  try {
    console.log("Event", event);

    if (!event.body) {
      throw new Error("No event body found");
    }
    // Access properties directly from the event body
    const {
      email,
      fullAddress,
      desiredStartingMonth,
      actualOrExpectedBirthMonth,
      revokedAt,
    } = JSON.parse(event.body);

    // Log the extracted properties
    console.log("Email:", email);
    console.log("Full Address:", fullAddress);
    console.log("Desired Starting Month:", desiredStartingMonth);
    console.log("Actual or Expected Birth Month:", actualOrExpectedBirthMonth);
    console.log("Revoked At:", revokedAt);
    const existingUser = await EmailServiceSignupModel.findOne({
      email: email,
    });
    if (existingUser) {
      return "User already signed up";
    }

    const id = uuidv4();
    const consentId = uuidv4();
    const createdDocument = await EmailServiceSignupModel.create({
      id: id,
      email: email,
      fullAddress: fullAddress,
      desiredStartingMonth: desiredStartingMonth,
      actualOrExpectedBirthMonth: actualOrExpectedBirthMonth,
      revokedAt: revokedAt || null,
      sendEmail: true,
      consentId: consentId,
    });
    console.info(`User ${email} signed up for kita finder service`);

    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!consentId)
      throw new Error(
        "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
      );

    // if consentedAt is null send confirmationEmail
    let bodyContent = "";
    console.log("createdDocument: ", createdDocument);
    console.log("createdDocument.consentedAt: ", createdDocument.consentedAt);
    if (createdDocument.consentedAt == null) {
      console.log("not consented yet");
      bodyContent = render(
        <ConsentConfirmationEmail
          consentId={consentId}
          serviceName={"Kita-Finder"}
        />
      );
    } else {
      bodyContent = render(<ServiceSignupEmail consentId={consentId} />);
    }
    if (!bodyContent) throw new Error("Something went wrong");
    await sendEmail({
      to,
      body: bodyContent,
      subject: "Neue Anmeldungen für deine Kita",
    });
    // await sendSNS(SNS, process.env.SNS_SUCCESS_ARN);
  } catch (e) {
    console.error(e);

    // await sendSNS(SNS, process.env.SNS_ERROR_ARN);
    throw e;
  }
};
