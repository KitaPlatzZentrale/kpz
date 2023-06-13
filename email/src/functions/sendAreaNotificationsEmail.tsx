import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";

import AreaNotificationsEmail, {
  AreaNotificationsEmailProps,
} from "../templates/areaNotifications";

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
 *   "to": "recipient@example.com",
 *   "props": {
 *     "areaDescription": "Example Area",
 *     "consentId": "ABC123"
 *   }
 * }
 */

interface EmailProps {
  detail: {
    fullDocument: {
      uuid: string;
      email: string;
      areaDescription: string;
      consentId: string;
      createdAt: string;
      consentedAt: string; // same as createdAt, important to track this separately for GDPR reasons
      revokedAt?: string | null;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { areaDescription, consentId, email } = event.detail.fullDocument;
  const to = email;

  if (!to) throw new Error("No recipient with `to` specified");
  if (!areaDescription)
    throw new Error(
      "No description with `areaDescription` specified. Aborting. This will otherwise result in messy copy."
    );
  if (!consentId)
    throw new Error(
      "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
    );

  const body = render(
    <AreaNotificationsEmail
      areaDescription={areaDescription}
      consentId={consentId}
    />
  );

  await sendEmail({
    to,
    body,
    subject: "Neue Anmeldungen für deine Kita",
  });
};
