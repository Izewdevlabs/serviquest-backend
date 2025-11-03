import express from "express";
import {
  createPayment,
  getPayments,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manage service payments and transaction history
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 78
 *         booking_id:
 *           type: integer
 *           example: 45
 *         user_id:
 *           type: integer
 *           example: 8
 *         amount:
 *           type: number
 *           example: 150.0
 *         status:
 *           type: string
 *           enum: [pending, paid, refunded, failed]
 *           example: "paid"
 *         payment_method:
 *           type: string
 *           example: "credit_card"
 *         transaction_id:
 *           type: string
 *           example: "TXN-748392-A"
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Retrieve all payments for current user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get("/", protect, getPayments);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment record
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 */
router.post("/", protect, createPayment);

export default router;
