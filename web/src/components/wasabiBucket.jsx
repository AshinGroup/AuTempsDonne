const AWS = require("aws-sdk");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_API_WASABI_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_API_WASABI_SECRET_KEY,
  endpoint: new AWS.Endpoint(process.env.REACT_APP_API_WASABI_ENDPOINT),
  region: "us-east-1",
  s3ForcePathStyle: true,
});

function parseS3Url(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname.split("/");
  return {
    Bucket: path[1],
    Key: path.slice(2).join("/"),
  };
}

async function updateContentTypeIfNeeded(Bucket, Key, isHTML) {
  if (isHTML) {
    try {
      const headData = await s3.headObject({ Bucket, Key }).promise();

      // Check if Content-Type is already set to text/html
      if (headData.ContentType === "text/html") {
        return;
      }

      const copyParams = {
        Bucket,
        CopySource: `${Bucket}/${Key}`,
        Key,
        MetadataDirective: "REPLACE",
        ContentType: "text/html",
        Metadata: headData.Metadata,
      };

      await s3.copyObject(copyParams).promise();
    } catch (err) {
      console.error("Error updating Content-Type", err);
      throw err;
    }
  }
}

/**
 * Fetch a signed URL from S3
 */
async function fetchBucket(url, isHTML = false) {
  const { Bucket, Key } = parseS3Url(url);

  // Update content type if needed
  await updateContentTypeIfNeeded(Bucket, Key, isHTML);

  const params = {
    Bucket,
    Key,
    Expires: 300,
  };

  try {
    const signedUrl = s3.getSignedUrl("getObject", params);
    return signedUrl;
  } catch (err) {
    console.error("Error creating signed URL", err);
    throw err;
  }
}

export default fetchBucket;
