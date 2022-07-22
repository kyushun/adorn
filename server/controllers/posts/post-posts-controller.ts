import fetch from "node-fetch";

import { asyncHandler } from "@/server/utils/express";
import { prisma } from "@/server/utils/prisma";
import s3 from "@/server/utils/s3";
import { Tweet } from "@/server/utils/tweet";

const extractIdFromUrl = (url: string) => {
  const match = url.match(/^(?:https:\/\/)?twitter.com\/.+\/status\/(\d+)/);

  return match?.[1] || url;
};

export const postPostsController = asyncHandler(async (req, res) => {
  const requestedId: string | undefined = req.body.id;
  if (requestedId == undefined) {
    return res
      .status(400)
      .json({ error: "Missing required parameter for tweet id" });
  }

  const id = extractIdFromUrl(requestedId);

  let tweet: Tweet;
  try {
    tweet = await Tweet.getTweet(id);
  } catch (e) {
    return res.status(404).json({ error: "Tweet not found" });
  }

  if (!tweet.hasImage) {
    return res.status(404).json({ error: "Image not found" });
  }

  const exists = await prisma.post
    .count({
      where: { id: tweet.id },
    })
    .then(Boolean);

  if (exists) {
    return res.status(409).json({ error: `This tweet already exists` });
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
