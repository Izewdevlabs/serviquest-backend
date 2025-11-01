import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Booking from "./bookingModel.js";
import User from "./userModel.js";

const Dispute = sequelize.define("Dispute", {
  issue: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM("open", "under_review", "resolved", "dismissed"),
    defaultValue: "open"
  },
  resolution_notes: { type: DataTypes.TEXT }
});

Dispute.belongsTo(Booking, { foreignKey: "booking_id" });
Dispute.belongsTo(User, { as: "raised_by", foreignKey: "raised_by_id" });

export default Dispute;
