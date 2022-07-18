import express from "express";

import imagesRouter from "./images";
import twitterRouter from "./twitter";

const router = express.Router();

router.use("/twitter", twitterRouter);
router.use("/images", imagesRouter);

export default router;
