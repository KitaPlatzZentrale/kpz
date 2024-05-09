import { APIGatewayEvent, Handler } from "aws-lambda";
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

export const handler: Handler<APIGatewayEvent> = async (event) => {
  try {
    const users = await UserModel.find();

    for (const user of users) {
      const userKitas: string[] = [];
      for (const kita of user.trackedKitas) {
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
        if (userKitas.length > 0) {
          await sendEmail({
            to: user.email,
            body,
            subject: "Neue Plätze verfügbar",
          });
          console.log(
            `Email sent successfully to ${user}, kitas: ${userKitas}`
          );
        }
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
  Januar: "01",
  Februar: "02",
  März: "03",
  April: "04",
  Mai: "05",
  Juni: "06",
  Juli: "07",
  August: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Dezember: "12",
};
function convertMonth(monthString) {
  const [monthName, year] = monthString.split(" ");
  const month = monthMap[monthName];
  if (!month) {
    throw new Error(`Invalid month name: ${monthName}`);
  }
  return `${year}-${month}-01`;
}

function isKitaAvailable(kitaDetails, desiredDate) {
  const desiredTimestamp = new Date(desiredDate).getTime();
  for (const [date, availability] of kitaDetails.availability) {
    const timestamp = new Date(date).getTime();
    if (timestamp >= desiredTimestamp && availability) {
      return true;
    }
  }
  return false;
}
