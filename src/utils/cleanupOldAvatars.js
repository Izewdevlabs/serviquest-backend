import fs from "fs";
import path from "path";
import sequelize from "../config/db.js";
import User from "../models/user.js";

(async () => {
  try {
    const avatarDir = path.resolve("src", "uploads", "avatars");

    // Ensure directory exists
    if (!fs.existsSync(avatarDir)) {
      console.log("⚠️ No avatar directory found. Nothing to clean.");
      process.exit(0);
    }

    // 1️⃣  Fetch all avatar filenames currently stored in DB
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ["avatar_url"] });
    const activeAvatars = users
      .map((u) => u.avatar_url && path.basename(u.avatar_url))
      .filter(Boolean);

    // 2️⃣  Read existing files in uploads directory
    const allFiles = fs.readdirSync(avatarDir);

    // 3️⃣  Identify orphaned files (not linked to any user)
    const orphaned = allFiles.filter((file) => !activeAvatars.includes(file));

    if (orphaned.length === 0) {
      console.log("✅ No orphaned avatar files found. Clean directory!");
      process.exit(0);
    }

    console.log(`🧹 Found ${orphaned.length} orphaned avatar(s):`);
    orphaned.forEach((file) => console.log("  -", file));

    // 4️⃣  Delete orphaned files
    for (const file of orphaned) {
      const filePath = path.join(avatarDir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${file}:`, err.message);
      }
    }

    console.log("🎯 Avatar cleanup completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("🔥 Cleanup error:", err);
    process.exit(1);
  }
})();
