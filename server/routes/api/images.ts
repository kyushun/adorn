import express from "express";

import { asyncHandler } from "@/server/utils/express";
import { prisma } from "@/server/utils/prisma";
import { createImageUrl, createTwitterProfileUrl } from "@/server/utils/url";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const cursor = req.query.cursor as string | undefined;

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        text: true,
        postedAt: true,
        createdAt: true,
        user: true,
        images: {
          select: {
            id: true,
          },
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      where: {
        deletedAt: null,
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
  })
);

export default router;
