import { PrismaClient } from "@prisma/client";
import express from "express";

import { Tweet } from "./utils/tweet";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/twitter", async (req, res) => {
  const id = req.query.id as string | undefined;
  if (id == undefined) {
    return res.status(404).send("invalid args");
  }

  let tweet: Tweet;
  try {
    tweet = await Tweet.getTweet(id);
  } catch (e) {
    console.error(e);
    return res.status(404).send("not found");
  }

  const imageIds = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.upsert({
      where: {
        id: tweet.userId,
      },
      update: {},
      create: {
        id: tweet.userId,
        name: tweet.username,
      },
    });

    const post = await prisma.post.create({
      data: {
        id: tweet.id,
        text: tweet.text,
        postedAt: tweet.postDate,
        userId: user.id,
      },
    });

    const images = await Promise.all(
      tweet.imageUrls!.map(async (_, index) => {
        return await prisma.image.create({ data: { index, postId: post.id } });
      })
    );

    return images.sort((image) => image.index).map((image) => image.id);
  });

  res.json(imageIds);
});

export default router;
