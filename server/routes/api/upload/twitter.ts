import express from "express";

import { prisma } from "../../../utils/prisma";
import s3 from "../../../utils/s3";
import { Tweet } from "../../../utils/tweet";

const router = express.Router();

const extractIdFromUrl = (url: string) => {
  const match = url.match(/^https:\/\/twitter.com\/.+\/status\/(\d+)/);

  return match?.[1] || url;
};

router.get("/", async (req, res) => {
  const queryId = req.query.id as string | undefined;
  if (queryId == undefined) {
    return res.status(404).send("invalid args");
  }

  const id = extractIdFromUrl(queryId);

  let tweet: Tweet;
  try {
    tweet = await Tweet.getTweet(id);
  } catch (e) {
    console.error(e);
    return res.status(404).send("not found");
  }

  const exists = await prisma.post
    .count({
      where: { id: tweet.id },
    })
    .then(Boolean);

  if (exists) {
    return res.status(404).send("exists");
  }

  const imageIds = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.upsert({
      where: { id: tweet.userId },
      update: { name: tweet.username },
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
      tweet.imageUrls!.map(async (imageUrl, index) => {
        const image = await prisma.image.create({
          data: { order: index, postId: post.id },
        });

        const imageRes = await fetch(imageUrl);

        if (!imageRes.body) {
          throw new Error("image fetch error");
        }

        await s3.client
          .upload({
            Bucket: s3.bucketName,
            Key: s3.createImageKey(image.id),
            Body: imageRes.body,
            ContentType: imageRes.headers.get("Content-Type") || undefined,
          })
          .promise();

        return image;
      })
    );

    const imageIds = images
      .sort((image) => image.order)
      .map((image) => image.id);

    return imageIds;
  });

  res.json(imageIds);
});

export default router;
