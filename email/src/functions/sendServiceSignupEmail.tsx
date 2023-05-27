import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";
import ServiceSignupEmail from "../templates/serviceSignup";

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
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { email, consentId } = event.detail.fullDocument;
  const to = email;

  if (!to) throw new Error("No recipient with `to` specified");
  if (!consentId)
    throw new Error(
      "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
    );

  const body = render(<ServiceSignupEmail consentId={consentId} />);

  await sendEmail({
    to,
    body,
    subject: "Neue Anmeldungen für deine Kita",
  });
};
