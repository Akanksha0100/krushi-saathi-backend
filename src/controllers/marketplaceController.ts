import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { MarketplaceListing } from "../models/MarketplaceListing.js";

export const getListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await MarketplaceListing.find().lean();

    const formattedListings = listings.map((listing) => ({
      id: listing._id?.toString(),
      name: listing.name,
      farmer: listing.farmer,
      location: listing.location,
      price: listing.price,
      emoji: listing.emoji,
      phone: listing.phone,
    }));

    res.json(formattedListings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const { name, farmer, location, price, emoji, phone } = req.body;

    if (!name || !farmer || !location || !price || !emoji || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const listing = new MarketplaceListing({
      name,
      farmer,
      farmerId: req.userId,
      location,
      price,
      emoji,
      phone,
    });

    await listing.save();

    res.status(201).json({
      id: listing._id,
      name: listing.name,
      farmer: listing.farmer,
      location: listing.location,
      price: listing.price,
      emoji: listing.emoji,
      phone: listing.phone,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await MarketplaceListing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Only allow farmer who created it or admin to delete
    if (listing.farmerId !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this listing" });
    }

    await MarketplaceListing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};
