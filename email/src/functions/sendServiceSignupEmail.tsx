import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";

import ServiceSignupEmail from "../templates/serviceSignup";
import { sendSNS, setupSNS } from "../sender/sendSNS";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";

dotenv.config();

interface EmailProps {
  data: {
    uuid: string;
    email: string;
    consentId: string;
    fullAddress: string;
    desiredStartingMonth: string;
    actualOrExpectedBirthMonth: string;
    createdAt: string;
    consentedAt: string | null; // same as createdAt, important to track this separately for GDPR reasons
    revokedAt?: string | null;
  };
}

const sendServiceSingupEmail = async (data: EmailProps) => {
  const SNS = setupSNS();
  if (!process.env.SNS_ERROR_ARN)
    throw new Error("No SNS_ERROR_ARN specified in environment variables");
  if (!process.env.SNS_SUCCESS_ARN)
    throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  if (!process.env.API_URL) throw new Error("No API_URL specified");
  try {
    const { email, consentId, consentedAt } = data.data;
    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!consentId)
      throw new Error(
        "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
      );

    // if consentedAt is null send confirmationEmail
    let body = "";
    if (consentedAt == null) {
      body = render(
        <ConsentConfirmationEmail
          consentId={consentId}
          serviceName={"Kita-Finder"}
          API_URL={process.env.API_URL}
        />
      );
    } else {
      body = render(
        <ServiceSignupEmail
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
      "singupToKitaFinderServiceEmail"
    );
  } catch (e) {
    console.error(e);

    await sendSNS(
      SNS,
      process.env.SNS_ERROR_ARN,
      "singupToKitaFinderServiceEmail"
    );
  }
};

export default sendServiceSingupEmail;
