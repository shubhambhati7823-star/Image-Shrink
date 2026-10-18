
import multer from "multer";
import type { RequestHandler } from "express";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 1,
    parts: 2,
  },

  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG and WEBP images are allowed")
      );
    }

    cb(null, true);
  },
});

export const receiveImage: RequestHandler = (req, res, next) => {
  upload.single("image")(req, res, (error?: unknown) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const isTooLarge = error.code === "LIMIT_FILE_SIZE";

      return res.status(isTooLarge ? 413 : 400).json({
        success: false,
        message: isTooLarge
          ? "Image must be 10 MB or smaller"
          : error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Image upload failed",
    });
  });
};
