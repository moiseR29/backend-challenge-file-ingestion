import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { AwsCredentials } from './Aws';
import { Environment } from '../../config';
import { Readable } from 'stream';

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

  async getObjectBody(key: string): Promise<Buffer> {
    const bucket = Environment.aws().bucket;

    const params: GetObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const response = await this._client.send(command);
    const body = response.Body as Readable;
    if (!body) throw new Error('Empty S3 body');
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
