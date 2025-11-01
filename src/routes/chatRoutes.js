import express from "express";
const router = express.Router();

// Temporary route for chat
router.get("/", (req, res) => {
  res.json({ message: "💬 Chat route active" });
});

export default router;
