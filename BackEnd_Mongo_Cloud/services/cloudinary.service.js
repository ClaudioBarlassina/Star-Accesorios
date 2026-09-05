import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const buildWebUrl = (secureUrl) => {
  if (!secureUrl || typeof secureUrl !== "string") return secureUrl;
  if (!secureUrl.includes("/image/upload/")) return secureUrl;
  if (
    secureUrl.includes("/image/upload/f_auto") ||
    secureUrl.includes("/image/upload/f_")
  ) {
    return secureUrl;
  }
  return secureUrl.replace("/image/upload/", "/image/upload/f_auto/");
};

export const uploadImage = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const deleteImage = (public_id) => {
  return cloudinary.uploader.destroy(public_id);
};