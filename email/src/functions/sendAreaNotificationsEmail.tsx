import * as React from "react";

import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import {
  SNSClient,
  SNSClientConfig,
  PublishCommand,
} from "@aws-sdk/client-sns";

import type { Handler } from "aws-lambda";

import AreaNotificationsEmail, {
  AreaNotificationsEmailProps,
} from "../templates/areaNotifications";
import dotenv from "dotenv";

dotenv.config();
/**
 * Lambda Function: EmailSenderHandler
 *
 * Description:
 * This Lambda function handles sending area notifications emails to recipients.
 * It receives an event object containing the recipient's email address and the email properties.
 * The function validates the required properties and generates the email body using the provided props.
 * Finally, it sends the email using the sendEmail function.
 *
 * ...

 * Sample Event:
 * {
 *   "detail": {
 *     "fullDocument": {
 *       "email": "recipient@example.com",
 *       "areaDescription": "Example Area",
 *       "consentId": "ABC123"
 *     }
 *   }
 * }
 */

interface EmailProps {
  detail: {
    fullDocument: {
      email: string;
      consentId: string;
      createdAt: string;
      consentedAt: string; // same as createdAt, important to track this separately for GDPR reasons
      areaDescription: string;
    };
  };
}

export const handler: Handler = async (event: EmailProps, ctx) => {
  const snsClientConfig: SNSClientConfig = {
    region: "eu-central-1",
  };
  const SNS = new SNSClient(snsClientConfig); // Example for Amazon SNS

  try {
    const { email, areaDescription, consentId } = event.detail.fullDocument;
    const to = email;
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
  } catch (e) {
    console.error(e);
    const event = {
      detail: {
        alarmName: "sendAreaNotificationAlarm",
        resources: [
          `arn:aws:lambda:eu-central-1:897331788878:function/${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
        ],
      },
    };

    const params = {
      Message: JSON.stringify(event),
      TopicArn: "arn:aws:sns:eu-central-1:897331788878:5XX_ALARM_TOPIC",
      MessageAttributes: {
        "Content-Type": {
          DataType: "String",
          StringValue: "application/json",
        },
      },
    };
    const command = new PublishCommand(params);
    SNS.send(command);
    throw e;
  }
};
