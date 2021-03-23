import AWS from "aws-sdk"

AWS.config.update({
  region: 'ca-central-1',
  credentials: {
    accessKeyId: process.env.GATSBY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.GATSBY_AWS_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: 'flr-101-staging' }
});

export default s3;