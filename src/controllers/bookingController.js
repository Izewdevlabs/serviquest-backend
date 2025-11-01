import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";

export const createBooking = async (req, res) => {
  try {
    const { service_id, scheduled_time } = req.body;
    const customer_id = req.user.id;

    const service = await Service.findByPk(service_id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const booking = await Booking.create({
      service_id,
      customer_id,
      provider_id: service.provider_id,
      scheduled_time,
      total_amount: service.price
    });

// Notify the provider
    const provider = await User.findByPk(service.provider_id);
    if (provider.fcm_token) {
      await sendPushNotification(
        provider.fcm_token,
        "New Booking Request",
        `You have a new booking for ${service.title}`,
        { bookingId: booking.id.toString() }
      );
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { customer_id: userId },
      include: { all: true }
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
