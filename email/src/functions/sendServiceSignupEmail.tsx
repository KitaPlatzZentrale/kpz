import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";
import ServiceSignupEmail from "../templates/serviceSignup";
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
      consentedAt: string; // same as createdAt, important to track this separately for GDPR reasons
      revokedAt?: string | null;
      sendEmail?: boolean;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { email, consentId } = event.detail.fullDocument;
  const to = email;
  const shouldSendEmail = event.detail.fullDocument.sendEmail ?? true;

  if (!to) throw new Error("No recipient with `to` specified");
  if (!consentId)
    throw new Error(
      "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
    );

  const body = render(<ServiceSignupEmail consentId={consentId} />);
  if (!shouldSendEmail) return;
  await sendEmail({
    to,
    body,
    subject: "Neue Anmeldungen für deine Kita",
  });
};
