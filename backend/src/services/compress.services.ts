import sharp from "sharp";

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

export async function compressImage(
  input: Buffer,
  quality: number
): Promise<Buffer> {
  try {
    const metadata = await sharp(input).metadata();

    const allowedFormats = ["jpeg", "png", "webp"];

    if (
      !metadata.format ||
      !allowedFormats.includes(metadata.format)
    ) {
      throw new ImageProcessingError(
        "Only JPG, PNG and WEBP images are supported"
      );
    }

    const compressedImage = await sharp(input)
      .rotate()
      .webp({ quality })
      .toBuffer();

    return compressedImage;
  } catch (error) {
    if (error instanceof ImageProcessingError) {
      throw error;
    }

    throw new ImageProcessingError(
      "Unable to process this image. Please select a valid image."
    );
  }
}