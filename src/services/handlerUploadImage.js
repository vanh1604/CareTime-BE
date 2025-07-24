import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const handlerUploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "users",
      resource_type: "image",
    });

    fs.unlinkSync(file.path); // Delete local temp file

    return res.status(200).json({
      success: true,
      file_url: result.secure_url,
    });
  } catch (error) {
    console.error("🔥 Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
