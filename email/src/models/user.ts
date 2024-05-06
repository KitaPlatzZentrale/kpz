import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
    consentId: { type: String, default: uuidv4(), required: true },
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
export { UserModel };
