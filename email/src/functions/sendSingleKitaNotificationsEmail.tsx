import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";
// import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

dotenv.config();

interface EmailProps {
  data: {
    email: string;
    kitaId: string;
    kitaName: string;
    kitaDesiredAvailability: string;
    sendEmail?: Boolean;
    consentId: string;
    createdAt: string;
    consentedAt: string; // same as createdAt, important to track this separately for GDPR reasons
    revokedAt?: string | null;
  };
}

const sendSingleKitaNotificationSignupEmail = async (data: EmailProps) => {
  // const SNS = setupSNS();
  // if (!process.env.SNS_ERROR_ARN)
  //   throw new Error("No SNS_ERROR_ARN specified in environment variables");
  // if (!process.env.SNS_SUCCESS_ARN)
  //   throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  console.log("sendSingleKitaNotificationSignupEmail", data);
  if (!process.env.API_URL) throw new Error("No API_URL specified");
  try {
    const { email, kitaName, consentId, consentedAt } = data.data;
    console.log("process.env.API_URL", process.env.API_URL);
    console.log("email", email);
    console.log("kitaName", kitaName);
    console.log("consentId", consentId);
    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!kitaName)
      throw new Error(
        "No kita name with `kitaName` specified. Aborting. This will otherwise result in messy copy."
      );

    // if consentedAt is null send confirmationEmail
    let body = "";
    if (consentedAt == null) {
      body = render(
        <ConsentConfirmationEmail
          consentId={consentId}
          serviceName={"Kita-Notification"}
          API_URL={process.env.API_URL}
        />
      );
    } else {
      body = render(
        <SingleKitaNotificationsEmail
          kitaName={kitaName}
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
    // await sendSNS(
    //   SNS,
    //   process.env.SNS_SUCCESS_ARN,
    //   "signupToSingleKitaAvailableEmail"
    // );
  } catch (e) {
    console.error(e);
    // await sendSNS(
    //   SNS,
    //   process.env.SNS_ERROR_ARN,
    //   "signupToSingleKitaAvailableEmail"
    // );
  }
};

export default sendSingleKitaNotificationSignupEmail;
