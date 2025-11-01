import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create a new Stripe payment intent
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 */

// Example: Stripe test endpoint
router.post("/create-payment-intent", async (req, res) => {
  try {
    res.json({ success: true, message: "Stripe payment endpoint works!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
