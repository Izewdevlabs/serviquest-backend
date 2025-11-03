// src/utils/passwordValidator.js

import zxcvbn from "zxcvbn";

/**
 * Enhanced password validation with zxcvbn + structural checks.
 * Returns: { isValid: boolean, score: number, errors: string[], feedback: string[] }
 */
export function validatePassword(password) {
  const errors = [];
  const feedback = [];

  if (!password) {
    return {
      isValid: false,
      score: 0,
      errors: ["Password is required."],
      feedback,
    };
  }

  // ───── Basic Structural Rules ─────
  if (password.length < 8) errors.push("Password must be at least 8 characters long.");
  if (!/[A-Z]/.test(password)) errors.push("Password must include at least one uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Password must include at least one lowercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Password must include at least one number.");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must include at least one special symbol.");

  // ───── Entropy-Based Strength (zxcvbn) ─────
  const result = zxcvbn(password);
  const score = result.score; // 0–4
  const zxcvbnFeedback = result.feedback?.suggestions || [];

  // Add zxcvbn recommendations
  if (zxcvbnFeedback.length) feedback.push(...zxcvbnFeedback);

  // ───── Final Evaluation ─────
  // Require both: structural integrity + zxcvbn entropy >= 3
  const isValid = errors.length === 0 && score >= 3;

  return {
    isValid,
    score,
    errors,
    feedback,
  };
}
