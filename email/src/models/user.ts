import mongoose, { Schema, Document } from "mongoose";

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
  consentedAt: string | null;
  sendEmail?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    email: { type: String, required: true },
    consentId: { type: String, required: true },
    trackedKitas: [
      {
        id: { type: String, required: true },
        kitaName: { type: String, required: true },
        kitaAvailability: { type: String, required: true },
      },
    ],
    createdAt: { type: String, default: Date.now, required: true },
    consentedAt: { type: String, default: null },
    sendEmail: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("user", UserSchema);
interface IEmailServiceSignup extends Document {
  id: string;
  email: string;
  consentId: string;
  fullAddress: string;
  desiredStartingMonth: string;
  actualOrExpectedBirthMonth: string;
  createdAt: string;
  consentedAt: string | null;
  revokedAt?: string | null;
  sendEmail?: boolean;
}

const EmailServiceSignupSchema: Schema = new Schema({
  id: { type: String, required: true },
  email: {
    type: String,
    required: true,
  },
  consentId: { type: String, required: true },
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
  consentedAt: { type: String, default: null },
  revokedAt: {
    type: String,
    default: null,
  },
  sendEmail: { type: Boolean, default: true },
});

const EmailServiceSignupModel = mongoose.model<IEmailServiceSignup>(
  "emailService",
  EmailServiceSignupSchema
);

export { EmailServiceSignupModel, UserModel };
