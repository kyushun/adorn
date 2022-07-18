import express from "express";

import imagesRouter from "./images";
import uploadRouter from "./upload";

const router = express.Router();

router.use("/upload", uploadRouter);
router.use("/images", imagesRouter);

export default router;
