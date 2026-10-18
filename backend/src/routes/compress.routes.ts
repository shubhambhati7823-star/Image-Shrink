import { Router } from "express";

import { receiveImage } from "../middlewares/upload.middleware.js";
import { compressImageController } from "../controllers/compress.controller.js";

const router = Router();

router.post(
  "/compress",
  receiveImage,
  compressImageController
);

export default router;