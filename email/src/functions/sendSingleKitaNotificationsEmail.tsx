import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";

import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";

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
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { email, trackedKitas, consentId } = event.detail.fullDocument;
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

  await sendEmail({
    to,
    body,
    subject: "Neue Anmeldungen für deine Kita",
  });
};
