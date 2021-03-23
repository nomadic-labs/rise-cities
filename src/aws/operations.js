import aws from './init';

export const uploadFile = file => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.GATSBY_AWS_BUCKET_NAME,
      Key: `storage/${file.name}`,
      Body: file,
      ACL: "public-read"
    }

    aws.upload(params, (err, data) => {
      if (err) {
        console.log("AWS error", err)
        reject(`Error uploading file: ${err}`)
      }

      console.log("AWS data", data)
      if (process.env.GATSBY_AWS_DOMAIN && process.env.GATSBY_FILESTORAGE_DOMAIN) {
        const awsUrl = data["Location"]
        const fileKey = awsUrl.split(process.env.GATSBY_AWS_DOMAIN)[1]
        const cloudfrontUrl = `${process.env.GATSBY_FILESTORAGE_DOMAIN}${fileKey}`
        resolve(cloudfrontUrl)
      } else {
        resolve(data["Location"])
      }
    })
  });
}



