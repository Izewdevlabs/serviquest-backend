import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 */

// Basic test endpoint
router.get("/", (req, res) => {
  res.json({ message: "📅 Booking route active" });
});

export default router;
