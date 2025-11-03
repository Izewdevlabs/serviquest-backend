import express from "express";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateStrongPassword } from "../middlewares/validateStrongPassword.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ─────────────── MULTER CONFIG FOR AVATAR UPLOAD ───────────────
const uploadDir = path.join(process.cwd(), "src", "uploads", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `temp-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and account management
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 full_name:
 *                   type: string
 *                   example: Test Admin
 *                 email:
 *                   type: string
 *                   example: admin@serviquest.com
 *                 role:
 *                   type: string
 *                   example: admin
 *                 avatar_url:
 *                   type: string
 *                   example: /uploads/avatars/optimized-temp-123456.webp
 */
router.get("/me", protect, getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile (name/email)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Test Admin Updated
 *               email:
 *                 type: string
 *                 example: admin2@serviquest.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/me", protect, updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password (validated via zxcvbn)
 *     description: |
 *       Allows the authenticated user to change their password.  
 *       The new password is validated using **zxcvbn** for strength and entropy scoring.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 example: N3wP@ssword2025!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Weak password or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password is too weak.
 *                 score:
 *                   type: integer
 *                   example: 1
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Password must include at least one uppercase letter."
 *                     - "Password must include at least one special character."
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Add another word or two. Uncommon words are better."
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/change-password", protect, validateStrongPassword, changePassword);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 avatar_url:
 *                   type: string
 *                   example: /uploads/avatars/optimized-temp-1732130416.webp
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
