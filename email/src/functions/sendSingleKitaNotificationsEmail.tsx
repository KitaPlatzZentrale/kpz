import * as React from "react";
import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import type { APIGatewayEvent, Handler } from "aws-lambda";
import SingleKitaNotificationsEmail from "../templates/singleKitaNotifications";
import dotenv from "dotenv";
import ConsentConfirmationEmail from "../templates/consentConfirmation";
import { UserModel } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import mongoose, { ConnectOptions } from "mongoose";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable not found");
}

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions);

export const handler: Handler<APIGatewayEvent> = async (event) => {
  try {
    console.log("Event", event);
    if (!event.body) {
      throw new Error("No event body found");
    }
    const eventData = JSON.parse(event.body); // Parse the event body
    let consentId = "";
    let existingUser = await UserModel.findOne({ email: eventData.email }); // Access properties from parsed event data
    console.log("Existing user: ", existingUser);

    if (existingUser) {
      consentId = existingUser.consentId;
      const isKitaAlreadySignedUp = existingUser.trackedKitas.some(
        (kita) => kita.id === eventData.kitaId
      );
      if (!isKitaAlreadySignedUp) {
        existingUser.trackedKitas.push({
          id: eventData.kitaId,
          kitaName: eventData.kitaName,
          kitaAvailability: eventData.kitaDesiredAvailability,
        });
        await existingUser.save();
      }
    } else {
      existingUser = await UserModel.create({
        id: uuidv4(),
        email: eventData.email,
        trackedKitas: [
          {
            id: eventData.kitaId,
            kitaName: eventData.kitaName,
            kitaAvailability: eventData.kitaDesiredAvailability,
          },
        ],
        sendEmail: eventData.sendEmail || true,
        consentId: uuidv4(),
      });
      consentId = existingUser.consentId;
    }

    console.info(
      `User ${eventData.email} signed up for ${eventData.kitaName} with id ${eventData.kitaId}`
    );

    const { email, kitaName } = eventData;
    const to = email;

    if (!to) {
      throw new Error("No recipient with `to` specified");
    }

    if (!kitaName) {
      throw new Error(
        "No kita name with `kitaName` specified. Aborting. This will otherwise result in messy copy."
      );
    }

    let body = "";
    if (existingUser && existingUser.consentedAt == null) {
      body = render(
        <ConsentConfirmationEmail
          consentId={existingUser.consentId}
          serviceName={"Kita-Notification"}
        />
      );
    } else {
      body = render(
        <SingleKitaNotificationsEmail
          kitaName={kitaName}
          consentId={consentId}
        />
      );
    }

    if (!body) {
      throw new Error("Something went wrong");
    }

    await sendEmail({
      to,
      body,
      subject: "Neue Anmeldungen für deine Kita",
    });

    return "Email sent";
  } catch (e) {
    console.error(e);
    return e;
  }
};
