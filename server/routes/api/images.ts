import { PrismaClient } from "@prisma/client";
import express from "express";

import { createImageUrl, createTwitterProfileUrl } from "../../utils/url";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", async (req, res) => {
  const cursor = req.query.cursor as string | undefined;

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      text: true,
      postedAt: true,
      createdAt: true,
      user: true,
      images: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
        },
      },
    },
    skip: cursor ? 1 : undefined,
    take: 30,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    posts: posts.map(({ images, user, ...post }) => ({
      ...post,
      user: user
        ? { ...user, url: createTwitterProfileUrl(user.id) }
        : undefined,
      images: images.map((v) => ({ url: createImageUrl(v.id) })),
    })),
    cursor: posts.length > 0 ? posts[posts.length - 1].id : undefined,
  });
});

export default router;
