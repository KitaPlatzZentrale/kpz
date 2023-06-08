import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IArea extends Document {
  email: string;
  areaDescription: string;
  consentId: string;
  createdAt: string;
  consentedAt: string;
  revokedAt?: string | null;
}

const AreaSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    areaDescription: { type: String, required: true },
    consentId: { type: String, default: uuidv4(), required: true },
    createdAt: { type: String, default: Date.now, required: true },
    consentedAt: { type: String, default: Date.now, required: true },
    revokedAt: { type: String, default: null },
  },
  { timestamps: true }
);
const AreaModel = mongoose.model<IArea>("area", AreaSchema);

interface IUser extends Document {
  id: string;
  email: string;
  consentId: string;
  trackedKitas: {
    id: string;
    kitaName: string;
    kitaAvailability: string;
  }[];
  createdAt: string;
  consentedAt: string;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    email: { type: String, required: true },
    consentId: { type: String, default: uuidv4(), required: true },
    trackedKitas: [
      {
        id: { type: String, required: true },
        kitaName: { type: String, required: true },
        kitaAvailability: { type: String, required: true },
      },
    ],
    createdAt: { type: String, default: Date.now, required: true },
    consentedAt: { type: String, default: Date.now, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("user", UserSchema);

interface IEmailServiceSignup extends Document {
  email: string;
  consentId: string;
  fullAddress: string;
  desiredStartingMonth: string;
  actualOrExpectedBirthMonth: string;
  createdAt: string;
  consentedAt: string;
  revokedAt?: string | null;
}

const EmailServiceSignupSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  consentId: { type: String, default: uuidv4(), required: true },
  fullAddress: {
    type: String,
    required: true,
  },
  desiredStartingMonth: {
    type: String,
    required: true,
  },
  actualOrExpectedBirthMonth: {
    type: String,
    required: true,
  },
  createdAt: { type: String, default: Date.now, required: true },
  consentedAt: { type: String, default: Date.now, required: true },
  revokedAt: {
    type: String,
    default: null,
  },
});

const EmailServiceSignupModel = mongoose.model<IEmailServiceSignup>(
  "emailService",
  EmailServiceSignupSchema
);

export { EmailServiceSignupModel, UserModel, AreaModel };
