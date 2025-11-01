import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "completed"),
    defaultValue: "pending",
  },
});

Booking.belongsTo(User, { as: "customer", foreignKey: "customerId" });
Booking.belongsTo(User, { as: "provider", foreignKey: "providerId" });

export default Booking;
