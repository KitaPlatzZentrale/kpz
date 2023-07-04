import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";
import ServiceSignupEmail from "../templates/serviceSignup";
import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

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

 * Sample Event:
 * {
 *   "detail": {
 *     "fullDocument": {
 *       "uuid": "12345",
 *       "email": "recipient@example.com",
 *       "consentId": "ABC123",
 *       "fullAddress": "123 Example Street, City",
 *       "desiredStartingMonth": "June",
 *       "actualOrExpectedBirthMonth": "July",
 *       "createdAt": "2023-06-08T12:00:00Z",
 *       "consentedAt": "2023-06-08T12:00:00Z",
 *       "revokedAt": null
 *     }
 *   }
 * }
 */

interface EmailProps {
  detail: {
    fullDocument: {
      uuid: string;
      email: string;
      consentId: string;
      fullAddress: string;
      desiredStartingMonth: string;
      actualOrExpectedBirthMonth: string;
      createdAt: string;
      consentedAt: string | null; // same as createdAt, important to track this separately for GDPR reasons
      revokedAt?: string | null;
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
    const { email, consentId } = event.detail.fullDocument;
    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!consentId)
      throw new Error(
        "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
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
      body = render(<ServiceSignupEmail consentId={consentId} />);
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
