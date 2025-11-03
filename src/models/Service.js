import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Service = sequelize.define(
  "Service",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING, defaultValue: "hour" },
    category: { type: DataTypes.STRING, allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "Services",
    timestamps: true,   // ensure Sequelize manages createdAt/updatedAt
    underscored: false, // keep default camelCase for timestamps
  }
);

// Define relationships
Service.belongsTo(User, { as: "provider", foreignKey: "provider_id" });
User.hasMany(Service, { as: "services", foreignKey: "provider_id" });

export default Service;
