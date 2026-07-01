import cloudinary, { ensureCloudinaryConfig } from "../config/cloudinary.js";

export const uploadToCloudinary = async (file) => {
  ensureCloudinaryConfig();

  // Cloudinary accepts a data URI string, so we convert the in-memory multer buffer.
  const base64Image = file.buffer.toString("base64");
  const imageUri = `data:${file.mimetype};base64,${base64Image}`;

  return cloudinary.uploader.upload(imageUri, {
    folder: "auth-express-profile-images"
  });
};

export const removeFromCloudinary = async (publicId) => {
  if (!publicId) {
    return null;
  }

  // Delete the old image when a new one replaces it.
  ensureCloudinaryConfig();
  return cloudinary.uploader.destroy(publicId);
};
