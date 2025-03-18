import { Schema } from "mongoose";

export const addressSchema = new Schema(
  {
    city: { type: String },
    country: { type: String },
    contactInfo: { type: Number },
  },
  { _id: false }
);
