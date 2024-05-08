import * as React from "react";
import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import type { Handler } from "aws-lambda";
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

export const handler: Handler = async (event: any, ctx) => {
  try {
    console.log("Event body: ", event.body);
    let consentId = "";
    let existingUser = await UserModel.findOne({ email: event.body.email });
    console.log("Existing user: ", existingUser);

    if (existingUser) {
      consentId = existingUser.consentId;
      const isKitaAlreadySignedUp = existingUser.trackedKitas.some(
        (kita) => kita.id === event.body.kitaId
      );
      if (!isKitaAlreadySignedUp) {
        existingUser.trackedKitas.push({
          id: event.body.kitaId,
          kitaName: event.body.kitaName,
          kitaAvailability: event.body.kitaDesiredAvailability,
        });
        await existingUser.save();
      }
    } else {
      existingUser = await UserModel.create({
        id: uuidv4(),
        email: event.body.email,
        trackedKitas: [
          {
            id: event.body.kitaId,
            kitaName: event.body.kitaName,
            kitaAvailability: event.body.kitaDesiredAvailability,
          },
        ],
        sendEmail: event.body.sendEmail || true,
        consentId: uuidv4(),
      });
      consentId = existingUser.consentId;
    }

    console.info(
      `User ${event.body.email} signed up for ${event.body.kitaName} with id ${event.body.kitaId}`
    );

    const { email, kitaName } = event.body;
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
