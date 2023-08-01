import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import AreaNotificationsEmail from "../templates/areaNotifications";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

import dotenv from "dotenv";
import { sendSNS, setupSNS } from "../sender/sendSNS";
dotenv.config();

interface EmailProps {
  data: {
    email: string;
    consentId: string;
    createdAt: string;
    consentedAt: string | null;
    areaDescription: string;
  };
}

const sendAreaNotificationSingupEmail = async (data: EmailProps) => {
  if (!process.env.API_URL) throw new Error("No API_URL specified");
  const SNS = setupSNS();
  try {
    const { email, areaDescription, consentId, consentedAt } = data.data;
    const to = email;
    if (!to) throw new Error("No recipient with `to` specified");
    if (!areaDescription)
      throw new Error(
        "No description with `areaDescription` specified. Aborting. This will otherwise result in messy copy."
      );

    // if consentedAt is null send confirmationEmail
    let body = "";
    if (consentedAt == null) {
      body = render(
        <ConsentConfirmationEmail
          consentId={consentId}
          serviceName={"Area Notification"}
          API_URL={process.env.API_URL}
        />
      );
    } else {
      body = render(
        <AreaNotificationsEmail
          areaDescription={areaDescription}
          consentId={consentId}
          API_URL={process.env.API_URL}
        />
      );
    }
    if (!body) throw new Error("Something went wrong");
    await sendEmail({
      to,
      body,
      subject: "Neue Anmeldungen für deine Kita",
    });
    await sendSNS(
      SNS,
      process.env.SNS_SUCCESS_ARN,
      "signupToAreaNotificationEmail"
    );
  } catch (e) {
    console.error(e);
    await sendSNS(
      SNS,
      process.env.SNS_ERROR_ARN,
      "signupToAreaNotificationEmail"
    );
    throw e;
  }
};

export default sendAreaNotificationSingupEmail;
