// src/controllers/paymentController.js
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import User from "../models/user.js";

/**
 * 💳 Create a payment
 */
export const createPayment = async (req, res) => {
  try {
    const { booking_id, amount, payment_method, transaction_id, status } = req.body;
    const user_id = req.user?.id;

    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ message: "Booking ID, amount, and payment method are required." });
    }

    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const payment = await Payment.create({
      booking_id,
      user_id,
      amount,
      payment_method,
      transaction_id: transaction_id || `TXN-${Date.now()}`,
      status: status || "completed",
    });

    res.status(201).json({
      message: "Payment recorded successfully.",
      payment,
    });
  } catch (error) {
    console.error("❌ Create Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📋 Get all payments (admin or user)
 */
export const getPayments = async (req, res) => {
  try {
    const user = req.user;
    const whereClause = user.role === "admin" ? {} : { user_id: user.id };

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(payments);
  } catch (error) {
    console.error("❌ Fetch Payments Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔍 Get a single payment by ID
 */
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
    });

    if (!payment) return res.status(404).json({ message: "Payment not found." });

    res.json(payment);
  } catch (error) {
    console.error("❌ Get Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✏️ Update payment status
 */
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    await payment.update(updates);
    res.json({
      message: "Payment updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("❌ Update Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🗑️ Delete a payment
 */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    await payment.destroy();
    res.json({ message: "Payment deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};
