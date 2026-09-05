import multer from "multer";

const storage = multer.memoryStorage();

const ACOSTUMBRADOS = {
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "tipo de archivo no detectado"));
    }
    if (ACOSTUMBRADOS[file.mimetype]) {
      return cb(null, true);
    }
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", `tipo de archivo no soportado: ${file.mimetype}`));
  },
});