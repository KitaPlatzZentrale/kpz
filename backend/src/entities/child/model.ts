import { Schema, Document, model } from "mongoose";

interface IChildData extends Document {
  id: string;
  parentId: string;
  firstName: Schema.Types.Buffer;
  lastName: Schema.Types.Buffer;
  gender: Schema.Types.Buffer;
  actualOrExpectedBirthMonth: Schema.Types.Buffer;
  desiredStartingMonth: string;
  careHours: string[];
  createdAt: string;
  updatedAt: string;
}

const ChildDataSchema = new Schema<IChildData>(
  {
    id: { type: String, required: true },
    parentId: { type: String, required: true },
    firstName: { type: Schema.Types.Buffer, required: true },
    lastName: { type: Schema.Types.Buffer, required: true },
    gender: { type: Schema.Types.Buffer, required: true },
    actualOrExpectedBirthMonth: { type: Schema.Types.Buffer, required: true },
    desiredStartingMonth: { type: String, required: true },
    careHours: { type: [String], required: true },
  },
  { timestamps: true }
);

const ChildDataModel = model<IChildData>("child", ChildDataSchema);

export default ChildDataModel;
