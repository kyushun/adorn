import { PrismaClient } from "@prisma/client";
import express from "express";

import { createImageUrl, createTwitterProfileUrl } from "../../utils/url";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", async (_, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      text: true,
      postedAt: true,
      createdAt: true,
      user: true,
      images: {
        orderBy: {
          index: "asc",
        },
        select: {
          id: true,
        },
      },
    },
    take: 30,
  });

  return res.json(
    posts.map(({ images, user, ...post }) => ({
      ...post,
      user: user
        ? { ...user, url: createTwitterProfileUrl(user.id) }
        : undefined,
      images: images.map((v) => ({ url: createImageUrl(v.id) })),
    }))
  );
});

export default router;
