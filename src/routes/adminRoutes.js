import express from "express";
import {
  getDashboardStats,
  verifyProvider,
  getDisputes,
  resolveDispute
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js"; // we’ll add this next
import Payment from "../models/Payment.js"; // optional




const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.put("/verify/:id", protect, verifyProvider);
router.get("/disputes", protect, getDisputes);
router.put("/disputes/:id/resolve", protect, resolveDispute);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin stats
 */
router.get("/stats", protect, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProviders = await User.count({ where: { role: "provider" } });
    const totalBookings = Booking ? await Booking.count() : 0;
    const totalRevenue = Payment ? await Payment.sum("amount") : 0;

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
