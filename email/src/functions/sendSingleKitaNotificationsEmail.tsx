import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";
import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";
import { Handler } from "express";

dotenv.config();

interface EmailProps {
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
}

const handler: Handler = async (req, res) => {
  const data: EmailProps = req.body;
  const SNS = setupSNS();
  if (!process.env.SNS_ERROR_ARN)
    throw new Error("No SNS_ERROR_ARN specified in environment variables");
  if (!process.env.SNS_SUCCESS_ARN)
    throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  if (!process.env.API_URL) throw new Error("No API_URL specified");
  try {
    const { email, trackedKitas, consentId } = data;
    const { kitaName } = trackedKitas[trackedKitas.length - 1];
    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!kitaName)
      throw new Error(
        "No kita name with `kitaName` specified. Aborting. This will otherwise result in messy copy."
      );

    // if consentedAt is null send confirmationEmail
    let body = "";
    if (data.consentedAt == null) {
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
    await sendSNS(
      SNS,
      process.env.SNS_SUCCESS_ARN,
      "signupToSingleKitaAvailableEmail"
    );
    res.status(200).send("Email sent");
  } catch (e) {
    console.error(e);
    await sendSNS(
      SNS,
      process.env.SNS_ERROR_ARN,
      "signupToSingleKitaAvailableEmail"
    );
    res.status(500).send("Something went wrong");
  }
};

export default handler;
