import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const Service = sequelize.define("Service", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  unit: { type: DataTypes.STRING, defaultValue: "hour" },
  category: { type: DataTypes.STRING, allowNull: false },
  available: { type: DataTypes.BOOLEAN, defaultValue: true }
});

Service.belongsTo(User, { as: "provider", foreignKey: "provider_id" });
User.hasMany(Service, { foreignKey: "provider_id" });

export default Service;
