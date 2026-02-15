import mongoose from "mongoose";

export interface IGovScheme {
  _id?: string;
  name: string;
  description: string;
  eligibility: string;
  benefit: string;
  icon: string;
  url?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GovSchemeSchema = new mongoose.Schema<IGovScheme>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    benefit: { type: String, required: true },
    icon: { type: String, required: true },
    url: { type: String },
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

export const GovScheme = mongoose.model<IGovScheme>("GovScheme", GovSchemeSchema);
