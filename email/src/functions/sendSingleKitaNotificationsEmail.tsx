import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";

import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";

/**
 * Lambda Function: SingleKitaNotificationsEmailHandler
 *
 * Description:
 * This Lambda function handles sending notification emails for a single Kita (childcare center) to recipients.
 * It receives an event object containing the details of the tracked Kita, including the email address, consent ID,
 * tracked Kita information, and other relevant data.
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
 *       "trackedKitas": [
 *         {
 *           "id": "kitaid123",
 *           "kitaName": "Example Kita",
 *           "kitaAvailability": "June"
 *         }
 *       ],
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
      trackedKitas: [
        {
          id: string;
          kitaName: string;
          kitaAvailability: string | null;
        }
      ];
      createdAt: string;
      consentedAt: string; // same as createdAt, important to track this separately for GDPR reasons
      revokedAt?: string | null;
      sendEmail?: boolean;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { email, trackedKitas, consentId } = event.detail.fullDocument;
  const shouldSendEmail = event.detail.fullDocument.sendEmail ?? true;
  const { kitaName } = trackedKitas[0];
  const to = email;

  if (!to) throw new Error("No recipient with `to` specified");
  if (!kitaName)
    throw new Error(
      "No kita name with `kitaName` specified. Aborting. This will otherwise result in messy copy."
    );
  if (!consentId)
    throw new Error(
      "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
    );

  const body = render(
    <SingleKitaNotificationsEmail kitaName={kitaName} consentId={consentId} />
  );
  if (!shouldSendEmail) return;
  await sendEmail({
    to,
    body,
    subject: "Neue Anmeldungen für deine Kita",
  });
};
