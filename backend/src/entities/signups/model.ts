import mongoose, { Schema, Document } from "mongoose";

interface IData extends Document {
  email: string;
  consentId: string;
  id: string;
  kitaName: string;
  kitaDesiredAvailability: string;
  createdAt: Date;
  consentedAt: Date;
}

const DataSchema: Schema = new Schema({
  email: { type: String, required: true },
  consentId: { type: String, required: true },
  id: { type: String, required: true },
  kitaName: { type: String, required: true },
  kitaDesiredAvailability: { type: String, required: true },
  createdAt: { type: Date, required: true },
  consentedAt: { type: Date, required: true },
});

const DataModel = mongoose.model<IData>("Data", DataSchema);

export default DataModel;
