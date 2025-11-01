import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";

import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";

import "./models/User.js";
import "./models/Booking.js";
import "./models/Payment.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "🚀 ServiQuest API is running successfully" });
});

// Register routes
app.use("/api/payments", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📥 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// Start server and connect DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    await sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`✅ ServiQuest API with Chat running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();
