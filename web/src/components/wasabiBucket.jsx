const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_API_WASABI_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_API_WASABI_SECRET_KEY,
  endpoint: new AWS.Endpoint(process.env.REACT_APP_API_WASABI_ENDPOINT),
  region: "eu-west-2",
});

function parseS3Url(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname.split("/");
  return {
    Bucket: path[1],
    Key: path.slice(2).join("/"),
  };
}

/**
 * Fetch a signed URL from S3
 */
async function fetchBucket(url) {
  const { Bucket, Key } = parseS3Url(url);
  const params = {
    Bucket,
    Key,
    Expires: 300,
  };

  try {
    const signedUrl = s3.getSignedUrl("getObject", params);
    // console.log("Signed URL: ", signedUrl);
    return signedUrl;
  } catch (err) {
    console.error("Error creating signed URL", err);
    throw err;
  }
}

export default fetchBucket;
