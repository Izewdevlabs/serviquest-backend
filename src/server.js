import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";


import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";

// -------------------- ROUTES --------------------
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { protect, adminOnly } from "./middlewares/authMiddleware.js";

// -------------------- MODELS --------------------
import "./models/user.js";
import "./models/Booking.js";
import "./models/Payment.js";
import "./models/Service.js";


// -------------------- APP SETUP --------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- MIDDLEWARE --------------------
app.use("/public", express.static("src/public"));
app.use(cors());
app.use(express.json());
app.use("/public", express.static("src/public"));
// ✅ Serve Swagger Docs
import { swaggerUiOptions } from "./config/swagger.js";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerUiOptions));

// ✅ Serve uploaded static files (avatars & media)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      // Add Cache-Control headers for efficiency
      if (filePath.endsWith(".webp") || filePath.endsWith(".png") || filePath.endsWith(".jpg")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// -------------------- ROUTES --------------------

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 ServiQuest API is running successfully" });
});

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Protected routes
app.use("/api/services", protect, serviceRoutes);
app.use("/api/bookings", protect, bookingRoutes);
app.use("/api/payments", protect, paymentRoutes);

// Admin routes
app.use("/api/admin", protect, adminOnly, adminRoutes);

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// -------------------- SOCKET.IO --------------------
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

// -------------------- DATABASE & SERVER --------------------
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ ServiQuest API with Chat running on port ${PORT}`);
      console.log(`📁 Serving static uploads from: ${path.join(__dirname, "uploads")}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();
