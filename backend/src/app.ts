import { errorHandler } from "./middlewares/error.middlewares.js";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import compressRouter from "./routes/compress.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: [
      "X-Original-Size",
      "X-Compressed-Size",
      "X-Compression-Percent",
    ],
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Image Shrink backend is running!",
  });
});

const compressionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 20, 
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many compression requests. Please try again later.",
  },
});

app.use("/api/compress", compressionLimiter);

app.use("/api", compressRouter);

app.use(errorHandler);

export default app;
