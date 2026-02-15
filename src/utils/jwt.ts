import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn: "7d" }
  ) as string;
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};
