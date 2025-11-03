import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/user.js";

/**
 * 🧾 Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const { service_id, booking_date, notes } = req.body;
    const user_id = req.user?.id;

    if (!service_id || !booking_date) {
      return res.status(400).json({ message: "Service and booking date are required." });
    }

    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    const booking = await Booking.create({
      user_id,
      service_id,
      booking_date,
      notes,
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Create Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📋 Get all bookings (Admin or User)
 */
export const getBookings = async (req, res) => {
  try {
    const user = req.user;

    const whereClause =
      user.role === "admin" ? {} : { user_id: user.id };

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "title", "price", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📄 Get a single booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "title", "price", "category"],
        },
      ],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found." });
    res.json(booking);
  } catch (error) {
    console.error("❌ Get Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✏️ Update booking status or details
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    await booking.update(updates);
    res.json({
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Update Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ❌ Cancel a booking
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Cancel Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🗑️ Delete booking
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await booking.destroy();
    res.json({ message: "Booking deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};
