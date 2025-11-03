import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { validatePassword } from "../utils/passwordValidator.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────
// ✅ Get Current Authenticated User Profile
// ─────────────────────────────────────────────
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "full_name", "email", "role", "verified", "avatar_url", "createdAt"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// ─────────────────────────────────────────────
// ✅ Update Profile Info (Name / Email)
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.full_name = full_name || user.full_name;
    user.email = email || user.email;

    await user.save();

    res.json({
      message: "✅ Profile updated successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ─────────────────────────────────────────────
// ✅ Change Password (Secure, With Verification)
// ─────────────────────────────────────────────
// ✅ Change user password securely

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    // Validate password strength
    const { isValid, errors } = validatePassword(newPassword);
    if (!isValid) {
      return res.status(400).json({
        message: "Password does not meet strength requirements",
        errors,
      });
    }

    // Hash and update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ✅ Upload and Optimize Avatar
// ─────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const avatarDir = path.join("src", "uploads", "avatars");
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

    const avatarPath = req.file.path;
    const optimizedName = `optimized-${Date.now()}.webp`;
    const optimizedPath = path.join(avatarDir, optimizedName);

    // ✅ Resize & optimize image
    await sharp(avatarPath)
      .resize(256, 256, { fit: "cover" })
      .toFormat("webp", { quality: 85 })
      .toFile(optimizedPath);

    // Delete the original temp file
    fs.unlinkSync(avatarPath);

    // ✅ Update user record
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove old avatar file if exists
    if (user.avatar_url) {
      const oldPath = path.join("src", user.avatar_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar_url = `/uploads/avatars/${optimizedName}`;
    await user.save();

    res.json({
      message: "✅ Avatar uploaded successfully",
      avatar_url: user.avatar_url,
    });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};
