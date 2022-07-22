import express from "express";

import postsRouter from "./posts";
import uploadRouter from "./upload";

const router = express.Router();

router.use("/upload", uploadRouter);
router.use("/posts", postsRouter);

export default router;
