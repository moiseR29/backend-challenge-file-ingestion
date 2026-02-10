import { FileStorage } from '../core/JobStorage';
import { Aws } from '../../services/aws';
import { Environment } from '../../config';

export class S3FileStorage implements FileStorage {
  async upload(buffer: Buffer, key: string): Promise<void> {
    const aws = new Aws();
    const bucket = Environment.aws().bucket;

    await aws.s3().upload({ bucket, data: buffer, key });
  }
}
