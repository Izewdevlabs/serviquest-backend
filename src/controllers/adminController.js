import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";
import Dispute from "../models/disputeModel.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProviders = await User.count({ where: { role: "provider" } });
    const totalBookings = await Booking.count();
    const totalRevenue = await Booking.sum("total_amount", { where: { payment_status: "paid" } });

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyProvider = async (req, res) => {
  try {
    const provider = await User.findByPk(req.params.id);
    if (!provider || provider.role !== "provider")
      return res.status(404).json({ message: "Provider not found" });

    provider.verified = true;
    await provider.save();
    res.status(200).json({ message: "Provider verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.findAll({ include: [Booking, { model: User, as: "raised_by" }] });
    res.status(200).json(disputes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const { resolution_notes } = req.body;
    const dispute = await Dispute.findByPk(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });

    dispute.status = "resolved";
    dispute.resolution_notes = resolution_notes;
    await dispute.save();

    res.status(200).json({ message: "Dispute resolved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
