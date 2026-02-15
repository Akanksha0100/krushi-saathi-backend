import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";
import { MarketplaceListing } from "../models/MarketplaceListing.js";
import { GovScheme } from "../models/GovScheme.js";

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await MarketplaceListing.countDocuments();
    const totalSchemes = await GovScheme.countDocuments();
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(10).lean();

    res.json({
      stats: {
        totalUsers,
        totalListings,
        totalSchemes,
      },
      recentLogs,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").lean();

    const formattedUsers = users.map((user) => ({
      id: user._id?.toString(),
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    // Log action
    await AuditLog.create({
      adminId: req.userId!,
      action: "DELETE",
      entity: "User",
      entityId: typeof id === "string" ? id : id[0],
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["farmer", "admin", "expert"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password").lean();

    // Log action
    await AuditLog.create({
      adminId: req.userId!,
      action: "UPDATE",
      entity: "User",
      entityId: typeof id === "string" ? id : id[0],
      changes: { role },
    });

    res.json({
      id: user?._id,
      fullName: user?.fullName,
      email: user?.email,
      role: user?.role,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(logs);
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

export const getAllListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await MarketplaceListing.find().lean();

    const formattedListings = listings.map((listing) => ({
      id: listing._id?.toString(),
      name: listing.name,
      farmer: listing.farmer,
      farmerId: listing.farmerId,
      location: listing.location,
      price: listing.price,
      emoji: listing.emoji,
      phone: listing.phone,
      createdAt: listing.createdAt,
    }));

    res.json(formattedListings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};
