// src/routes/serviceRoutes.js
import express from "express";
import {
  createService,
  getServices,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Endpoints for managing service listings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         title:
 *           type: string
 *           example: "Home Electrical Installation"
 *         description:
 *           type: string
 *           example: "Certified electrician for household wiring and setup"
 *         price:
 *           type: number
 *           format: float
 *           example: 120.5
 *         unit:
 *           type: string
 *           example: "hour"
 *         category:
 *           type: string
 *           example: "Electrical"
 *         available:
 *           type: boolean
 *           example: true
 *         provider_id:
 *           type: integer
 *           example: 4
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all available services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get("/", protect, getServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post("/", protect, createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update an existing service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.put("/:id", protect, updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
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
 *         description: Service deleted successfully
 */
router.delete("/:id", protect, adminOnly, deleteService);

export default router;
