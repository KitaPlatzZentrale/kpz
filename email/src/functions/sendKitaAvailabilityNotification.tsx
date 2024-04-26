import { Handler } from "aws-lambda";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { UserModel } from "../models/user";
import KitaDetailModel from "../models/kita";
import sendEmail from "../sender/sendEmail";
import { render } from "@react-email/render";
import KitaAvailabilityEmail from "../templates/KitaAvailabilityEmail";
import React from "react";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable not found");
}
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions);

//** Check new availability of Kitas that User signed up for - Send a Email if they are available */

export const handler: Handler = async (event, context) => {
  try {
    const users = await UserModel.find();

    for (const user of users) {
      const userKitas = [];

      for (const kita of user.trackedKitas.map((kita) => kita)) {
        const kitaDetails = await KitaDetailModel.findOne({
          uuid: kita.id,
        });

        if (kitaDetails) {
          const desiredKitaAvailabilityDate = kita.kitaAvailability; // i.e Mai 2024
          const newFormatDesiredKitaAvailabilityDate = convertMonth(
            desiredKitaAvailabilityDate
          ); // i.e 2024-05-01
          if (
            isKitaAvailable(kitaDetails, newFormatDesiredKitaAvailabilityDate)
          ) {
            //@ts-ignore
            userKitas.push(kitaDetails.name);
          }
        }
      }
      try {
        const body = render(
          <KitaAvailabilityEmail
            kitaNames={userKitas}
            consentId={user.consentId}
          />
        );

        await sendEmail({
          to: user.email,
          body,
          subject: "Neue Plätze verfügbar",
        });
        console.log(`Email sent successfully to ${user}, kitas: ${userKitas}`);
      } catch (error) {
        console.error(
          `Error sending email to ${user.email}, kitas: ${userKitas}:`,
          error
        );
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notifications sent successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mär: "03",
  Apr: "04",
  Mai: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Okt: "10",
  Nov: "11",
  Dez: "12",
};

function convertMonth(monthString) {
  const [monthName, year] = monthString.split(" ");
  const month = monthMap[monthName];
  return `${year}-${month}-01`;
}

function isKitaAvailable(kitaDetails, desiredDate) {
  const desiredTimestamp = new Date(desiredDate).getTime();
  for (const date in kitaDetails.availability) {
    const timestamp = new Date(date).getTime();
    if (timestamp >= desiredTimestamp && kitaDetails.availability[date]) {
      return true;
    }
  }
  return false;
}
