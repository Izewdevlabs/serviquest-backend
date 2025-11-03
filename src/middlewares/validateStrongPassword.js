// src/middlewares/validateStrongPassword.js

import { validatePassword } from "../utils/passwordValidator.js";

/**
 * Middleware: Validate password strength before proceeding.
 * Uses zxcvbn entropy + structural rules.
 */
export const validateStrongPassword = (req, res, next) => {
  try {
    const password = req.body.password || req.body.newPassword;

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const { isValid, score, errors, feedback } = validatePassword(password);

    if (!isValid) {
      return res.status(400).json({
        message: "Password is too weak.",
        score,
        errors,
        feedback,
      });
    }

    next(); // ✅ Continue if password is strong
  } catch (err) {
    console.error("Password validation error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
