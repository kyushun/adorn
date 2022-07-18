import S3 from "aws-sdk/clients/s3";

export const client = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
});

export const bucketName = process.env.S3_BUCKET!;

export const createImageKey = (filename: string) => `images/${filename}`;

const s3 = {
  client,
  bucketName,
  createImageKey,
};

export default s3;
