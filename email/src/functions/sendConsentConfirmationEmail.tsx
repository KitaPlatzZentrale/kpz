import type { Handler } from "aws-lambda";
import sendEmail from "../sender/sendEmail";
import ConsentConfirmationEmail from "../templates/consentConfirmation";
import React from "react";
import { render } from "@react-email/render";
import { setupSNS } from "../sender/sendSNS";
import { sendSNS } from "../sender/sendSNS";

interface EmailProps {
  "detail-type": string;
  detail: {
    fullDocument: {
      email: string;
      consentId: string;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const SNS = setupSNS();
  if (!process.env.SNS_ERROR_ARN)
    throw new Error("No SNS_ERROR_ARN specified in environment variables");
  if (!process.env.SNS_SUCCESS_ARN)
    throw new Error("No SNS_SUCCESS_ARN specified in environment variables");
  try {
    const { email, consentId } = event.detail.fullDocument;
    const to = email;

    if (!to) throw new Error("No recipient with `to` specified");
    if (!consentId)
      throw new Error(
        "No consent id with `consentId` specified. This will otherwise result in a broken opt-out link (not compliant with GDPR)."
      );

    let serviceName = "";
    if (event["detail-type"].includes("emailservices")) {
      serviceName = "Kita-Finder";
    } else if (event["detail-type"].includes("areas")) {
      serviceName = "Area-Notification";
    } else if (event["detail-type"].includes("users")) {
      serviceName = "Kita-Notification";
    } else {
      throw new Error("No service name specified");
    }

    const body = render(
      <ConsentConfirmationEmail
        consentId={consentId}
        serviceName={serviceName}
      />
    );
    await sendEmail({
      to,
      body,
      subject: "Anmeldung zum Kita-Finder Service",
    });
    await sendSNS(SNS, process.env.SNS_SUCCESS_ARN);
  } catch (e) {
    console.error(e);

    await sendSNS(SNS, process.env.SNS_ERROR_ARN);
    throw e;
  }
};
