import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Customer and provider booking management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 45
 *         service_id:
 *           type: integer
 *           example: 12
 *         user_id:
 *           type: integer
 *           example: 8
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           example: "confirmed"
 *         scheduled_date:
 *           type: string
 *           format: date
 *           example: "2025-11-04"
 *         total_amount:
 *           type: number
 *           example: 250.75
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for current user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get("/", protect, getBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/", protect, createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking status or details
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking updated successfully
 */
router.put("/:id", protect, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel an existing booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 */
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
