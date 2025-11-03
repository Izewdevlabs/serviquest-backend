import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { validatePassword } from "../utils/passwordValidator.js";

/**
 * @desc Register a new user with strong password validation
 * @route POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // ───── Validate required fields ─────
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ───── Check if email already exists ─────
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // ───── Validate password strength (zxcvbn + structural) ─────
    const { isValid, errors, feedback, score } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({
        message: "Password is too weak.",
        score,
        errors,
        feedback,
      });
    }

    // ───── Hash password ─────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ───── Create new user ─────
    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role || "user",
      verified: false,
    });

    // ───── Generate JWT Token ─────
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Login existing user
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
