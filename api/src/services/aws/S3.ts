import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { AwsCredentials } from './Aws';

interface UploadS3 {
  bucket: string;
  key: string;
  data: Buffer;
}

export class S3 {
  private _client: S3Client;

  constructor(credentials: AwsCredentials) {
    this._client = new S3Client({
      endpoint: 'http://localstack:4566', //TODO: localstack = docker - localhost = host
      forcePathStyle: true,
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKey,
        secretAccessKey: credentials.secretKey,
      },
    });
  }

  getClient(): S3Client {
    return this._client;
  }

  async upload(opts: UploadS3) {
    try {
      const { bucket, data, key } = opts;

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: data,
      };
      const command = new PutObjectCommand(params);
      return await this._client.send(command);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
