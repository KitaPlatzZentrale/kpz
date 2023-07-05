import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import type { Handler } from "aws-lambda";

import AreaNotificationsEmail from "../templates/areaNotifications";
import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

dotenv.config();
/**
 * Lambda Function: EmailSenderHandler
 *
 * Description:
 * This Lambda function handles sending area notifications emails to recipients.
 * It receives an event object containing the recipient's email address and the email properties.
 * The function validates the required properties and generates the email body using the provided props.
 * Finally, it sends the email using the sendEmail function.
 *
 * ...

 * Sample Event:
 * {
 *   "detail": {
 *     "fullDocument": {
 *       "email": "recipient@example.com",
 *       "areaDescription": "Example Area",
 *       "consentId": "ABC123"
 *     }
 *   }
 * }
 */

interface EmailProps {
  detail: {
    fullDocument: {
      email: string;
      consentId: string;
      createdAt: string;
      consentedAt: string | null;
      areaDescription: string;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const SNS = setupSNS();
  if (!process.env.SNS_ERROR_ARN)
    throw new Error("No SNS_ERROR_ARN specified in environment variables");
  if (!process.env.SNS_SUCCESS_ARN)
    throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  try {
    const { email, areaDescription, consentId } = event.detail.fullDocument;
    const to = email;
    if (!to) throw new Error("No recipient with `to` specified");
    if (!areaDescription)
      throw new Error(
        "No description with `areaDescription` specified. Aborting. This will otherwise result in messy copy."
      );

    // if consentedAt is null send confirmationEmail
    let body = "";
    if (event.detail.fullDocument.consentedAt == null) {
      body = render(
        <ConsentConfirmationEmail
          consentId={consentId}
          serviceName={"Area Notification"}
        />
      );
    } else {
      body = render(
        <AreaNotificationsEmail
          areaDescription={areaDescription}
          consentId={consentId}
        />
      );
    }
    if (!body) throw new Error("Something went wrong");
    await sendEmail({
      to,
      body,
      subject: "Neue Anmeldungen für deine Kita",
    });
    await sendSNS(SNS, process.env.SNS_SUCCESS_ARN);
  } catch (e) {
    console.error(e);

    await sendSNS(SNS, process.env.SNS_ERROR_ARN);
    throw e;
  }
};
