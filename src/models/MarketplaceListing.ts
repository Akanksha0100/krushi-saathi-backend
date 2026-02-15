import mongoose from "mongoose";

export interface IMarketplaceListing {
  _id?: string;
  name: string;
  farmer: string;
  farmerId: string;
  location: string;
  price: string;
  emoji: string;
  phone: string;
  category?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MarketplaceListingSchema = new mongoose.Schema<IMarketplaceListing>(
  {
    name: { type: String, required: true },
    farmer: { type: String, required: true },
    farmerId: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    emoji: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, default: "produce" },
    description: { type: String },
  },
  { timestamps: true }
);

export const MarketplaceListing = mongoose.model<IMarketplaceListing>(
  "MarketplaceListing",
  MarketplaceListingSchema
);
