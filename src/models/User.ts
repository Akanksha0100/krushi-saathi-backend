import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: "farmer" | "admin" | "expert";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["farmer", "admin", "expert"],
      default: "farmer"
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
