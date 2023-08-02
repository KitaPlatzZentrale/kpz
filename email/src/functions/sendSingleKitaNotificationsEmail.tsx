import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";
import sendMessageToRabbitMQ from "../rabbitmqSender";

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
    const message = {
      type: "signupSuccess",
      event: "signupToSingleKitaAvailableEmail",
    };
    await sendMessageToRabbitMQ(message);
  } catch (e) {
    console.error(e);
    const message = {
      type: "error",
      event: "signupToSingleKitaAvailableEmail",
    };
    await sendMessageToRabbitMQ(message);
  }
};

export default sendSingleKitaNotificationSignupEmail;
