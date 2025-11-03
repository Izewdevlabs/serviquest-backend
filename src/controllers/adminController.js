// src/controllers/adminController.js
import User from "../models/user.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

// ─────────────── Get all users ───────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "full_name", "email", "role", "verified", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────── Delete a user ───────────────
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────── Get platform statistics ───────────────
export const getSystemStats = async (req, res) => {
  try {
    const [userCount, bookingCount, totalRevenue] = await Promise.all([
      User.count(),
      Booking.count(),
      Payment.sum("amount"),
    ]);

    res.json({
      message: "System statistics fetched successfully",
      stats: {
        totalUsers: userCount || 0,
        totalBookings: bookingCount || 0,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (err) {
    console.error("Error fetching system stats:", err);
    res.status(500).json({ error: err.message });
  }
};
