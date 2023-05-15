import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";
import ServiceSignupEmail, {
  ServiceSignupEmailProps,
} from "../templates/serviceSignup";

interface EmailProps {
  to: string;
  props: ServiceSignupEmailProps;
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { to, props } = event;
  const { consentId } = props;

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
