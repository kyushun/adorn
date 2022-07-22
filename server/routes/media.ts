import S3 from "aws-sdk/clients/s3";
import express from "express";

import { asyncHandler } from "@/server/utils/express";
import { prisma } from "@/server/utils/prisma";
import s3 from "@/server/utils/s3";

const router = express.Router();

const forwardHeaders = ["content-type", "last-modified", "etag"] as const;

// https://github.com/dvonlehman/s3-proxy
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const key = req.params.id;

    const exists =
      (await prisma.image.count({
        where: {
          id: key,
          deletedAt: null,
        },
      })) !== 0;

    if (!exists) return res.status(404).json({ error: "File not found" });

    const s3Params: S3.GetObjectRequest = {
      Bucket: s3.bucketName,
      Key: s3.createImageKey(key),
      IfNoneMatch: req.headers["if-none-match"],
    };

    const s3Request = s3.client
      .getObject(s3Params)
      .on("httpHeaders", (_, s3Headers) => {
        forwardHeaders.forEach((header) => {
          var headerValue = s3Headers[header];

          if (headerValue) {
            res.set(header, headerValue);
          }
        });

        res.set("Cache-Control", "public, max-age=31536000");
      });

    const readStream = s3Request.createReadStream().on("error", (err: any) => {
      if (err.code === "NotModified" || err.code === "PreconditionFailed") {
        return res.status(304).end();
      }

      return next(err);
    });

    readStream.pipe(res);
  })
);

export default router;
