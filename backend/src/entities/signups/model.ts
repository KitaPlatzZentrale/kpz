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
  consentedAt: string;
}

const UserSchema: Schema = new Schema({
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
  createdAt: { type: String, required: true },
  consentedAt: { type: String, required: true },
});

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
  consentId: {
    type: String,
    required: true,
  },
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
  createdAt: {
    type: String,
    required: true,
  },
  consentedAt: {
    type: String,
    required: true,
  },
  revokedAt: {
    type: String,
    default: null,
  },
});

const EmailServiceSignupModel = mongoose.model<IEmailServiceSignup>(
  "emailService",
  EmailServiceSignupSchema
);

export { EmailServiceSignupModel, UserModel };
