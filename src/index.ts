import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database connection
let dbConnected = false;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/krushi-saathi", {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;
    console.log("✓ MongoDB connected");
  } catch (error) {
    dbConnected = false;
    console.warn("⚠ MongoDB connection failed - continuing with mock data");
    console.warn("⚠ All data will be stored in memory and lost on server restart");
  }
};

// Initialize DB
connectDB();

// Export DB status for controllers
export const isDBConnected = () => dbConnected;

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/weather", weatherRoutes);
app.use("/v1", llmRoutes);
app.use("/v1/schemes", schemeRoutes);
app.use("/v1/marketplace", marketplaceRoutes);
app.use("/v1/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Krushi Saathi Backend API",
    version: "1.0.0",
    status: "running",
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API documentation: https://api.krushisaathi.com/v1`);
});
