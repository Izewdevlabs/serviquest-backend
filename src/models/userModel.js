import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("customer", "provider", "admin"), defaultValue: "customer" },
  profile_photo: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  avg_rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default User;
