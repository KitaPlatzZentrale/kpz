import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import type { Handler } from "aws-lambda";

import AreaNotificationsEmail, {
  AreaNotificationsEmailProps,
} from "../templates/areaNotifications";

interface EmailProps {
  to: string;
  props: AreaNotificationsEmailProps;
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const { to, props } = event;
  const { areaDescription, consentId } = props;

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
