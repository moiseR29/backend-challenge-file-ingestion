import {
  SQSClient,
  SendMessageCommand,
  SendMessageBatchCommand,
  SendMessageCommandInput,
  SendMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';
import { AwsCredentials } from './Aws';

export interface SqsConfig {
  queueUrl: string;
  endpoint?: string;
}

export interface SendMessageOpts {
  messageBody: string;
  delaySeconds?: number;
}

export interface SendMessageBatchEntry {
  id: string;
  messageBody: string;
  delaySeconds?: number;
}

export class SQS {
  private _client: SQSClient;
  private _queueUrl: string;

  constructor(credentials: AwsCredentials, config: SqsConfig) {
    this._queueUrl = config.queueUrl;

    const clientConfig: ConstructorParameters<typeof SQSClient>[0] = {
      region: credentials.region,
      endpoint: 'http://localstack:4566', //TODO: localstack = docker - localhost = host
      credentials: {
        accessKeyId: credentials.accessKey,
        secretAccessKey: credentials.secretKey,
      },
    };

    if (config.endpoint) {
      clientConfig.endpoint = config.endpoint;
    }

    this._client = new SQSClient(clientConfig);
  }

  getClient(): SQSClient {
    return this._client;
  }

  getQueueUrl(): string {
    return this._queueUrl;
  }

  async sendMessage(opts: SendMessageOpts) {
    try {
      const params: SendMessageCommandInput = {
        QueueUrl: this._queueUrl,
        MessageBody: opts.messageBody,
      };
      if (opts.delaySeconds != null) {
        params.DelaySeconds = opts.delaySeconds;
      }
      const command = new SendMessageCommand(params);
      return await this._client.send(command);
    } catch (error: any) {
      console.error('Error sending message to SQS:', error?.message ?? error);
      throw error;
    }
  }

  async sendMessageBatch(entries: SendMessageBatchEntry[]) {
    try {
      const sqsEntries: SendMessageBatchRequestEntry[] = entries.map((e) => ({
        Id: e.id,
        MessageBody: e.messageBody,
        ...(e.delaySeconds != null && { DelaySeconds: e.delaySeconds }),
      }));
      const command = new SendMessageBatchCommand({
        QueueUrl: this._queueUrl,
        Entries: sqsEntries,
      });
      return await this._client.send(command);
    } catch (error: any) {
      console.error(
        'Error sending batch messages to SQS:',
        error?.message ?? error,
      );
      throw error;
    }
  }
}
