import express from "express";

import { Tweet } from "./utils/twitter";

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

  res.send(tweet.imageUrls);
});

export default router;
