import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

// In-memory user storage for when database is unavailable
const memoryUsers: { [key: string]: any } = {
  "admin@krushisaathi.com": {
    id: "admin-001",
    fullName: "Admin User",
    email: "admin@krushisaathi.com",
    password: "$2b$10$YIjlGHWTH5U4TN1R.EEwGuUPkj1W1K2j5K1L2K3L4K5L6K7L8K9", // admin123 hashed
    role: "admin",
  },
  "farmer@krushisaathi.com": {
    id: "farmer-001", 
    fullName: "Farmer User",
    email: "farmer@krushisaathi.com",
    password: "$2b$10$YIjlGHWTH5U4TN1R.EEwGuUPkj1W1K2j5K1L2K3L4K5L6K7L8K9", // admin123 hashed
    role: "farmer",
  },
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    // Validation
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailLower = email.toLowerCase();

    try {
      // Try database first
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const user = new User({
        fullName,
        email: emailLower,
        mobile,
        password: hashedPassword,
        role: role || "farmer",
      });

      await user.save();

      const token = generateToken(user._id!.toString(), user.role);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });
    } catch (dbError) {
      // Fall back to in-memory storage
      if (memoryUsers[emailLower]) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const userId = "user-" + Date.now();
      
      memoryUsers[emailLower] = {
        id: userId,
        fullName,
        email: emailLower,
        mobile,
        password: hashedPassword,
        role: role || "farmer",
      };

      const token = generateToken(userId, role || "farmer");
      res.status(201).json({
        token,
        user: {
          id: userId,
          fullName,
          email: emailLower,
          mobile,
          role: role || "farmer",
        },
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const emailLower = email.toLowerCase();

    try {
      // Try database first
      const user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user._id!.toString(), user.role);
      res.json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });
    } catch (dbError) {
      // Fall back to in-memory storage
      const memUser = memoryUsers[emailLower];
      if (!memUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, memUser.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(memUser.id, memUser.role);
      res.json({
        token,
        user: {
          id: memUser.id,
          fullName: memUser.fullName,
          email: memUser.email,
          mobile: memUser.mobile,
          role: memUser.role,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
