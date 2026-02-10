import { S3 } from './S3';
import { SQS } from './SQS';
import { Environment } from '../../config';

export interface AwsCredentials {
  region: string;
  accessKey: string;
  secretKey: string;
}

export class Aws {
  private _s3: S3;
  private _sqs: SQS;

  constructor() {
    const awsConfig = Environment.aws();
    const { accessKey, secretKey, region } = awsConfig.credentials;
    const credentials = { accessKey, region, secretKey };

    this._s3 = new S3(credentials);
    this._sqs = new SQS(credentials, {
      queueUrl: awsConfig.sqsQueueUrl,
      endpoint: awsConfig.sqsEndpoint,
    });
  }

  s3(): S3 {
    return this._s3;
  }

  sqs(): SQS {
    return this._sqs;
  }
}
