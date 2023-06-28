import mongoose from "mongoose";

const KitaDetailSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  availability: {
    type: Map,
    of: Boolean,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  capacity: {
    total: {
      type: Number,
      required: true,
    },
    underThree: {
      type: Number,
      required: true,
    },
  },
  minimumAcceptanceAgeInMonths: {
    type: Number,
    required: true,
  },
  contactDetails: {
    email: String,
    phone: String,
    website: String,
  },
  openingHours: {
    type: Map,
    of: {
      from: String,
      to: String,
    },
    required: true,
  },
  approach: {
    pedagogicalConcepts: [String],
    emphasis: [String],
    languages: [String],
    mixedAgesDescriptions: [String],
  },
  foundingDate: {
    type: String,
    required: true,
  },
  closingDate: {
    type: String,
  },
  version: {
    type: String,
    required: true,
  },
  checkSum: {
    type: String,
    required: true,
  },
});

const KitaDetailModel = mongoose.model("KitaDetail", KitaDetailSchema);

export default KitaDetailModel;
