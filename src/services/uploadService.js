const path = require("path");
const fs = require("fs");
import pool from "../config/connectDB"; // import mysql2 pool connection
import { v2 as cloudinary } from "cloudinary";
/**
 * Save avatar path to users table
 * @param {number} userId
 * @param {Express.Multer.File} file
 * @returns {Promise<{ success: boolean, message: string, avatarUrl?: string }>}
 */
export const uploadAvatar = async (userId, file) => {
  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
      resource_type: "image",
    });

    const avatarUrl = uploadResult.secure_url;

    const [result] = await pool.execute(
      "UPDATE users SET avatar = ? WHERE id = ?",
      [avatarUrl, userId]
    );

    fs.unlinkSync(file.path);

    if (result.affectedRows === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "Avatar uploaded", avatarUrl };
  } catch (error) {
    console.error("❌ uploadAvatar error:", error);
    return { success: false, message: "Server error" };
  }
};
