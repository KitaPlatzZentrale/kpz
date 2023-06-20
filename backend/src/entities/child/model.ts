import { Schema, Document, model } from "mongoose";

interface IChildData extends Document {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  actualOrExpectedBirthMonth: string;
  desiredStartingMonth: string;
  careHours: string[];
  createdAt: string;
  updatedAt: string;
}

const ChildDataSchema = new Schema<IChildData>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    actualOrExpectedBirthMonth: { type: String, required: true },
    desiredStartingMonth: { type: String, required: true },
    careHours: { type: [String], required: true },
  },
  { timestamps: true }
);

const ChildDataModel = model<IChildData>("ChildData", ChildDataSchema);

export default ChildDataModel;
