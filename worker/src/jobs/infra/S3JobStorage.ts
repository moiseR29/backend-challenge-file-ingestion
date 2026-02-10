import { FileStorage } from '../core';
import { Aws } from '../../services/aws';

export class S3JobStorage implements FileStorage {
  async getContent(key: string): Promise<Buffer> {
    const aws = new Aws();

    return await aws.s3().getObjectBody(key);
  }
}
