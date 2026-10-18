import type { RequestHandler } from "express";

import {
  compressImage,
  ImageProcessingError,
} from "../services/compress.services.js";

export const compressImageController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please select an image",
      });
      return;
    }

   
    const rawQuality: unknown = req.body?.quality;
    let quality = 75;

    if (rawQuality !== undefined) {
      if (
        typeof rawQuality !== "string" ||
        !/^\d+$/.test(rawQuality.trim())
      ) {
        res.status(400).json({
          success: false,
          message: "Quality must be a number between 10 and 100",
        });
        return;
      }

      quality = Number(rawQuality);

      if (
        !Number.isInteger(quality) ||
        quality < 10 ||
        quality > 100
      ) {
        res.status(400).json({
          success: false,
          message: "Quality must be between 10 and 100",
        });
        return;
      }
    }

    
    const compressedBuffer = await compressImage(
      req.file.buffer,
      quality
    );

    const originalSize = req.file.size;
    const compressedSize = compressedBuffer.length;

    const reductionPercent = Math.round(
      ((originalSize - compressedSize) / originalSize) * 100
    );

    res.setHeader("Content-Type", "image/webp");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="compressed.webp"'
    );

    res.setHeader("X-Original-Size", String(originalSize));
    res.setHeader("X-Compressed-Size", String(compressedSize));

    res.setHeader(
      "X-Compression-Percent",
      String(reductionPercent)
    );

    res.status(200).send(compressedBuffer);
  } catch (error) {
    if (error instanceof ImageProcessingError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};