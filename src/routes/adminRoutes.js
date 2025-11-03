// src/routes/adminRoutes.js

import express from "express";
import {
  getAllUsers,
  deleteUser,
  getSystemStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative management endpoints for ServiQuest
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         full_name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           example: "provider"
 *         verified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-31T12:00:00Z"
 *
 *     AdminStats:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "System statistics fetched successfully"
 *         stats:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: integer
 *               example: 124
 *             totalBookings:
 *               type: integer
 *               example: 356
 *             totalRevenue:
 *               type: number
 *               format: float
 *               example: 15400.50
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve all registered users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUser'
 */
router.get("/users", protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by their ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", protect, adminOnly, deleteUser);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform-wide statistics
 *     description: Returns aggregated counts for users, bookings, and total revenue.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved system statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStats'
 */
router.get("/stats", protect, adminOnly, getSystemStats);

export default router;
