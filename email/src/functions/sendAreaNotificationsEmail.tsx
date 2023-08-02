import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import AreaNotificationsEmail from "../templates/areaNotifications";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

import dotenv from "dotenv";
import sendMessageToRabbitMQ from "../rabbitmqSender";
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
    const message = {
      type: "signupSuccess",
      event: "signupToAreaNotificationEmail",
    };
    await sendMessageToRabbitMQ(message);
  } catch (e) {
    console.error(e);

    const message = { type: "error", event: "signupToAreaNotificationEmail" };
    await sendMessageToRabbitMQ(message);

    throw e;
  }
};

export default sendAreaNotificationSingupEmail;
