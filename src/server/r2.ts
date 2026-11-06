import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    // Return dummy or warning client for build/initialization if not yet configured
    console.warn(
      "R2 credentials not fully set; R2 operations will fail if called."
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId || "placeholder"}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId || "placeholder",
      secretAccessKey: secretAccessKey || "placeholder",
    },
  });
}

export const r2Client = getR2Client();
export const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME || "multivendor-bookshop";
