import express from "express";

import {
  getPostsController,
  postPostsController,
} from "@/server/controllers/posts";

const router = express.Router();

router.get("/", getPostsController);

router.post("/", postPostsController);

export default router;
