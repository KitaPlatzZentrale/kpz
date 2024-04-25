import { Schema, Document, model } from "mongoose";

interface IKitaDetail extends Document {
  uuid: string;
  name: string;
  number: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: {
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
  };
  availability: Map<string, boolean>;
  imageUrl: string;
  capacity: {
    total: number;
    underThree: number;
  };
  minimumAcceptanceAgeInMonths: number;
  contactDetails: {
    email?: string;
    phone?: string;
    website?: string;
  };
  openingHours: Map<string, { from: string; to: string }>;
  approach: {
    pedagogicalConcepts: string[];
    emphasis: string[];
    languages: string[];
    mixedAgesDescriptions: string[];
  };
  foundingDate: string;
  closingDate?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const KitaDetailSchema = new Schema<IKitaDetail>(
  {
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    address: {
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      zip: { type: String, required: true },
      city: { type: String, required: true },
    },
    availability: { type: Map, of: Boolean, required: true },
    imageUrl: { type: String, required: true },
    capacity: {
      total: { type: Number, required: true },
      underThree: { type: Number, required: true },
    },
    minimumAcceptanceAgeInMonths: { type: Number, required: true },
    contactDetails: {
      email: String,
      phone: String,
      website: String,
    },
    openingHours: {
      type: Map,
      of: { from: String, to: String },
      required: true,
    },
    approach: {
      pedagogicalConcepts: [String],
      emphasis: [String],
      languages: [String],
      mixedAgesDescriptions: [String],
    },
    foundingDate: { type: String, required: true },
    closingDate: { type: String },
    version: { type: String, required: false },
  },
  { timestamps: true }
);

const KitaDetailModel = model<IKitaDetail>("KitaDetail", KitaDetailSchema);

export default KitaDetailModel;
