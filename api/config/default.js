/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  sqlServer: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
  },
  aws: {
    credentials: {
      region: process.env.S3_AWS_REGION,
      accessKey: process.env.S3_AWS_ACCESS_KEY_ID,
      secretKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
    },
    bucket: process.env.S3_BUCKET,
    sqsQueueUrl: process.env.SQS_QUEUE_URL,
    sqsEndpoint: process.env.SQS_ENDPOINT,
  },
};
