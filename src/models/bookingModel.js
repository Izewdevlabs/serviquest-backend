import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import Service from "./serviceModel.js";

const Booking = sequelize.define("Booking", {
  scheduled_time: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "in_progress", "completed", "cancelled"),
    defaultValue: "pending"
  },
  total_amount: { type: DataTypes.DECIMAL(10,2) },
  payment_status: {
    type: DataTypes.ENUM("unpaid", "paid", "refunded"),
    defaultValue: "unpaid"
  },
  rating: { type: DataTypes.INTEGER },
  review: { type: DataTypes.TEXT }
});

Booking.belongsTo(User, { as: "customer", foreignKey: "customer_id" });
Booking.belongsTo(User, { as: "provider", foreignKey: "provider_id" });
Booking.belongsTo(Service, { foreignKey: "service_id" });

export default Booking;
