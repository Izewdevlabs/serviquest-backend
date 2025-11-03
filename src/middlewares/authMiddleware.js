import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";  // ensure lowercase if file is lowercase

dotenv.config();

/**
 * ✅ Middleware to protect routes and verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request (optional)
    req.user = await User.findByPk(decoded.id, {
      attributes: ["id", "full_name", "email", "role"],
    });

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

/**
 * ✅ Middleware to restrict access by role
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
